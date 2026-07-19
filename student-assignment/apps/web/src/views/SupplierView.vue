<template>
  <v-container fluid class="pa-6">
    <v-card class="elevation-2 rounded-lg">
      <v-card-title class="d-flex align-center py-4 px-6 bg-surface">
        <span class="text-h5 font-weight-bold">Supplier Management</span>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          elevation="2"
          @click="openDialog()"
          class="text-none"
        >
          New Supplier
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="px-6">
        <v-row class="mb-2">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search Suppliers"
              variant="outlined"
              density="compact"
              hide-details
              class="search-field"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="suppliers"
          :search="search"
          :loading="loading"
          class="supplier-table"
          hover
        >
          <template v-slot:item.phone="{ item }">
             {{ item.phone || '-' }}
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-end gap-2">
                <v-btn
                icon="mdi-pencil"
                variant="text"
                color="primary"
                size="small"
                @click="editItem(item)"
                tooltip="Edit"
                ></v-btn>
                <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                size="small"
                @click="confirmDelete(item)"
                tooltip="Delete"
                ></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-primary text-white d-flex justify-space-between align-center">
          <span class="text-h6">{{ formTitle }}</span>
          <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog" density="compact"></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-form ref="form" v-model="valid" @submit.prevent="save">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="Supplier Name"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'Name is required']"
                  required
                ></v-text-field>
              </v-col>
              
               <v-col cols="12">
                <v-text-field
                  v-model="editedItem.phone"
                  label="Phone"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>


              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.description"
                  label="Description"
                  variant="outlined"
                  rows="3"
                  density="compact"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog" class="mr-2">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="save"
            :loading="saving"
            :disabled="!valid"
          >
            {{ editedIndex === -1 ? 'Create ' : 'Update' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this supplier?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="deleteItemConfirm" :loading="deleting">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
     <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import api from '@/utils/axios';

// Interfaces
interface Supplier {
  id?: number;
  name: string;
  description?: string;
  phone?: string;
  image?: string;
}

// State
const suppliers = ref<Supplier[]>([]);
const search = ref('');
const loading = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const saving = ref(false);
const deleting = ref(false);
const valid = ref(false);
const editedIndex = ref(-1);

const snackbar = reactive({
    show: false,
    text: '',
    color: 'success'
});

const defaultItem: Supplier = {
  name: '',
  description: '',
  phone: '',
};

const editedItem = reactive<Supplier>({ ...defaultItem });

const headers: any = [
  { title: 'Name', key: 'name' },
  { title: 'Phone', key: 'phone' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Supplier' : 'Edit Supplier';
});

// Methods
const fetchSuppliers = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/suppliers');
    suppliers.value = data;
  } catch (error) {
    showSnackbar('Failed to fetch suppliers', 'error');
  } finally {
    loading.value = false;
  }
};

const openDialog = () => {
  editedIndex.value = -1;
  Object.assign(editedItem, defaultItem);
  dialog.value = true;
};

const editItem = (item: Supplier) => {
  editedIndex.value = suppliers.value.indexOf(item);
  Object.assign(editedItem, item);
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  setTimeout(() => {
     Object.assign(editedItem, defaultItem);
     editedIndex.value = -1;
  }, 300);
};

const confirmDelete = (item: Supplier) => {
  editedIndex.value = suppliers.value.indexOf(item);
  Object.assign(editedItem, item);
  deleteDialog.value = true;
};

const closeDelete = () => {
  deleteDialog.value = false;
  setTimeout(() => {
    Object.assign(editedItem, defaultItem);
    editedIndex.value = -1;
  }, 300);
};

const deleteItemConfirm = async () => {
    if (!editedItem.id) return;
    deleting.value = true;
    try {
        await api.delete(`/suppliers/${editedItem.id}`);
        if (editedIndex.value > -1) {
            suppliers.value.splice(editedIndex.value, 1);
        }
        showSnackbar('Supplier deleted successfully');
    } catch (error) {
        showSnackbar('Failed to delete supplier', 'error');
    } finally {
        deleting.value = false;
        closeDelete();
    }
};

const save = async () => {
    saving.value = true;
    try {
        const payload = { ...editedItem };
        
        if (editedIndex.value > -1) {
            // Update
            const { data } = await api.patch(`/suppliers/${editedItem.id}`, payload);
            const supplierToUpdate = suppliers.value[editedIndex.value];
            if (supplierToUpdate) {
                Object.assign(supplierToUpdate, data);
            }
            showSnackbar('Supplier updated successfully');
        } else {
            // Create
            const { data } = await api.post('/suppliers', payload);
            suppliers.value.push(data);
             showSnackbar('Supplier created successfully');
        }
        closeDialog();
    } catch (error) {
        console.error(error);
        showSnackbar('Operation failed', 'error');
    } finally {
        saving.value = false;
    }
};

const showSnackbar = (text: string, color: string = 'success') => {
    snackbar.text = text;
    snackbar.color = color;
    snackbar.show = true;
}

onMounted(() => {
  fetchSuppliers();
});
</script>

<style scoped>
.supplier-table :deep(th) {
    font-weight: 600 !important;
    text-transform: uppercase;
    font-size: 0.85rem;
    color: #666;
}
</style>
