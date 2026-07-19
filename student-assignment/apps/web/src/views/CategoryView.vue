<template>
  <v-container fluid class="pa-6">
    <v-card class="elevation-2 rounded-lg">
      <v-card-title class="d-flex align-center py-4 px-6 bg-surface">
        <span class="text-h5 font-weight-bold">Category Management</span>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          elevation="2"
          @click="openDialog()"
          class="text-none"
        >
          New Category
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="px-6">
        <v-row class="mb-2">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search Categories"
              variant="outlined"
              density="compact"
              hide-details
              class="search-field"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="categories"
          :search="search"
          :loading="loading"
          class="category-table"
          hover
        >
          <template v-slot:item.icon="{ item }">
              <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
              <span v-else>-</span>
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
                  label="Category Name"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'Name is required']"
                  required
                ></v-text-field>
              </v-col>
              
               <v-col cols="12">
                <v-text-field
                  v-model="editedItem.icon"
                  label="Icon (MDI Icon Name)"
                   placeholder="e.g., mdi-food"
                  variant="outlined"
                  density="compact"
                  hint="Enter a Material Design Icon name (e.g., mdi-chart-bar)"
                  persistent-hint
                >
                    <template v-slot:prepend-inner>
                         <v-icon v-if="editedItem.icon">{{ editedItem.icon }}</v-icon>
                    </template>
                </v-text-field>
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
        <v-card-text>Are you sure you want to delete this category?</v-card-text>
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
interface Category {
  id?: number;
  name: string;
  description?: string;
  icon?: string;
}

// State
const categories = ref<Category[]>([]);
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

const defaultItem: Category = {
  name: '',
  description: '',
  icon: '',
};

const editedItem = reactive<Category>({ ...defaultItem });

const headers: any = [
  { title: 'Name', key: 'name' },
  { title: 'Icon', key: 'icon', sortable: false },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Category' : 'Edit Category';
});

// Methods
const fetchCategories = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/categories');
    categories.value = data;
  } catch (error) {
    showSnackbar('Failed to fetch categories', 'error');
  } finally {
    loading.value = false;
  }
};

const openDialog = () => {
  editedIndex.value = -1;
  Object.assign(editedItem, defaultItem);
  dialog.value = true;
};

const editItem = (item: Category) => {
  editedIndex.value = categories.value.indexOf(item);
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

const confirmDelete = (item: Category) => {
  editedIndex.value = categories.value.indexOf(item);
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
        await api.delete(`/categories/${editedItem.id}`);
        if (editedIndex.value > -1) {
            categories.value.splice(editedIndex.value, 1);
        }
        showSnackbar('Category deleted successfully');
    } catch (error) {
        showSnackbar('Failed to delete category', 'error');
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
            const { data } = await api.patch(`/categories/${editedItem.id}`, payload);
            const categoryToUpdate = categories.value[editedIndex.value];
            if (categoryToUpdate) {
                Object.assign(categoryToUpdate, data);
            }
            showSnackbar('Category updated successfully');
        } else {
            // Create
            const { data } = await api.post('/categories', payload);
            categories.value.push(data);
             showSnackbar('Category created successfully');
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
  fetchCategories();
});
</script>

<style scoped>
.category-table :deep(th) {
    font-weight: 600 !important;
    text-transform: uppercase;
    font-size: 0.85rem;
    color: #666;
}
</style>
