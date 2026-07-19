<template>
  <v-container fluid class="pa-6">
    <v-card class="elevation-2 rounded-lg">
      <v-card-title class="d-flex align-center py-4 px-6 bg-surface">
        <span class="text-h5 font-weight-bold">Product Management</span>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          elevation="2"
          @click="openDialog()"
          class="text-none"
        >
          New Product
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="px-6">
        <v-row class="mb-2">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search Products"
              variant="outlined"
              density="compact"
              hide-details
              class="search-field"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="products"
          :search="search"
          :loading="loading"
          class="product-table"
          hover
        >
          <template v-slot:item.image="{ item }">
            <v-avatar size="48" rounded="lg" class="my-2 bg-grey-lighten-4">
              <v-img
                v-if="item.image"
                :src="item.image"
                cover
                :alt="item.name"
              ></v-img>
              <v-icon v-else icon="mdi-image-off" color="grey"></v-icon>
            </v-avatar>
          </template>

          <template v-slot:item.unit_price="{ item }">
            ${{ Number(item.unit_price).toFixed(2) }}
          </template>
          
           <template v-slot:item.category="{ item }">
            {{ item.category?.name || '-' }}
          </template>
          
           <template v-slot:item.supplier="{ item }">
            {{ item.supplier?.name || '-' }}
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-end gap-2">
                <v-btn
                icon="mdi-package-variant-plus"
                variant="text"
                color="success"
                size="small"
                @click="openStockDialog(item)"
                tooltip="Add Stock"
                ></v-btn>
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
    <v-dialog v-model="dialog" max-width="700px" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-primary text-white d-flex justify-space-between align-center">
          <span class="text-h6">{{ formTitle }}</span>
          <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog" density="compact"></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-form ref="form" v-model="valid" @submit.prevent="save">
            <v-row>
              <v-col cols="12" md="12" class="d-flex justify-center mb-4" v-if="editedItem.image || imagePreview">
                  <v-avatar size="100" rounded="lg" class="bg-grey-lighten-4">
                      <v-img :src="imagePreview || editedItem.image" cover></v-img>
                  </v-avatar>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.name"
                  label="Product Name"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'Name is required']"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editedItem.unit_price"
                  label="Price"
                  type="number"
                  prefix="$"
                  variant="outlined"
                  density="compact"
                   :rules="[v => !!v || 'Price is required', v => v >= 0 || 'Price must be non-negative']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editedItem.qty"
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  density="compact"
                   :rules="[v => !!v || 'Quantity is required', v => v >= 0 || 'Quantity must be non-negative']"
                ></v-text-field>
              </v-col>
              
                <v-col cols="12" md="6">
                 <v-file-input
                  v-model="imageFile"
                  label="Product Image"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  variant="outlined"
                  density="compact"
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera"
                  @update:model-value="handleFileChange"
                 ></v-file-input>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="editedItem.category_id"
                  :items="categories"
                  item-title="name"
                  item-value="id"
                  label="Category"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'Category is required']"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="editedItem.supplier_id"
                  :items="suppliers"
                  item-title="name"
                  item-value="id"
                  label="Supplier"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'Supplier is required']"
                ></v-select>
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

    <!-- Add Stock Dialog -->
    <v-dialog v-model="stockDialog" max-width="500px">
      <v-card>
        <v-card-title class="pa-4 bg-success text-white d-flex justify-space-between align-center">
          <span class="text-h6">Add Stock</span>
          <v-btn icon="mdi-close" variant="text" color="white" @click="closeStockDialog" density="compact"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4">
          <v-form ref="stockFormRef" v-model="stockValid" @submit.prevent="saveStock">
             <div class="text-subtitle-1 mb-2">Product: <strong>{{ stockItem.name }}</strong></div>
             <div class="text-caption mb-4">Current Stock: {{ stockItem.qty }}</div>
                          <v-row>
                 <v-col cols="12">
                  <v-text-field
                   v-model.number="stockForm.quantity"
                   label="Quantity to Add"
                   type="number"
                   variant="outlined"
                   density="compact"
                   min="1"
                   :rules="[v => !!v || 'Quantity is required', v => v > 0 || 'Must be greater than 0']"
                   autofocus
                 ></v-text-field>
                 </v-col>

                 <v-col cols="12" md="6">
                   <v-text-field
                    v-model.number="stockForm.stock_price"
                    label="Cost Price (Per Unit)"
                    type="number"
                    variant="outlined"
                    density="compact"
                    prefix="$"
                    :rules="[v => v >= 0 || 'Must be non-negative']"
                   ></v-text-field>
                 </v-col>

                 <v-col cols="12" md="6">
                   <v-text-field
                    v-model.number="stockForm.sale_price"
                    label="Sale Price (Per Unit)"
                    type="number"
                    variant="outlined"
                    density="compact"
                    prefix="$"
                    :rules="[v => v >= 0 || 'Must be non-negative']"
                   ></v-text-field>
                 </v-col>
                 
                 <v-col cols="12">
                  <v-select
                   v-model="stockForm.supplier_id"
                   :items="suppliers"
                   item-title="name"
                   item-value="id"
                   label="Supplier"
                   variant="outlined"
                   density="compact"
                   :rules="[v => !!v || 'Supplier is required']"
                 ></v-select>
                 </v-col>
              </v-row>
           </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
           <v-spacer></v-spacer>
           <v-btn color="grey-darken-1" variant="text" @click="closeStockDialog">Cancel</v-btn>
           <v-btn
            color="success"
            variant="flat"
            @click="saveStock"
            :loading="stockLoading"
            :disabled="!stockValid"
           >
             Add Stock
           </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this product?</v-card-text>
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
interface Product {
  id?: number;
  name: string;
  unit_price: number;
  qty: number;
  description: string;
  image?: string;
  category_id?: number;
  supplier_id?: number;
  category?: { id: number; name: string };
  supplier?: { id: number; name: string };
}

interface Category {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

// State
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const suppliers = ref<Supplier[]>([]);
const search = ref('');
const loading = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const saving = ref(false);
const deleting = ref(false);
const valid = ref(false);
const editedIndex = ref(-1);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const snackbar = reactive({
    show: false,
    text: '',
    color: 'success'
});

const defaultItem: Product = {
  name: '',
  unit_price: 0,
  qty: 0,
  description: '',
  category_id: undefined,
  supplier_id: undefined,
};

// Stock Dialog State
const stockDialog = ref(false);
const stockLoading = ref(false);
const stockValid = ref(false);
const stockItem = reactive<Product>({ ...defaultItem });
const stockForm = reactive({
    product_id: 0,
    quantity: 1,
    supplier_id: undefined as number | undefined,
    stock_price: 0,
    sale_price: 0
});

const editedItem = reactive<Product>({ ...defaultItem });

const headers: any = [
  { title: 'Image', key: 'image', sortable: false },
  { title: 'Name', key: 'name' },
  { title: 'Category', key: 'category' },
  { title: 'Supplier', key: 'supplier' },
  { title: 'Price', key: 'unit_price' },
  { title: 'Qty', key: 'qty' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Product' : 'Edit Product';
});

// Methods
const fetchProducts = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/products');
    products.value = data;
  } catch (error) {
    showSnackbar('Failed to fetch products', 'error');
  } finally {
    loading.value = false;
  }
};

const fetchDependencies = async () => {
    try {
        const [cats, supps] = await Promise.all([
            api.get('/categories'),
            api.get('/suppliers')
        ]);
        categories.value = cats.data;
        suppliers.value = supps.data;
    } catch (e) {
        console.error("Failed to load categories or suppliers");
    }
}

const openDialog = () => {
  editedIndex.value = -1;
  Object.assign(editedItem, defaultItem);
  imageFile.value = null;
  imagePreview.value = null;
  dialog.value = true;
};

const editItem = (item: Product) => {
  editedIndex.value = products.value.indexOf(item);
  Object.assign(editedItem, item);
  
  // Map relations if IDs are missing
  if (item.category && !item.category_id) {
      editedItem.category_id = item.category.id;
  }
  if (item.supplier && !item.supplier_id) {
      editedItem.supplier_id = item.supplier.id;
  }

  imageFile.value = null;
  imagePreview.value = null;
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  imageFile.value = null;
  imagePreview.value = null;
  setTimeout(() => {
     Object.assign(editedItem, defaultItem);
     editedIndex.value = -1;
  }, 300);
};

const confirmDelete = (item: Product) => {
  editedIndex.value = products.value.indexOf(item);
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
        await api.delete(`/products/${editedItem.id}`);
        if (editedIndex.value > -1) {
            products.value.splice(editedIndex.value, 1);
        }
        showSnackbar('Product deleted successfully');
    } catch (error) {
        showSnackbar('Failed to delete product', 'error');
    } finally {
        deleting.value = false;
        closeDelete();
    }
};

const handleFileChange = (file: any) => {
    // Vuetify file input returns Array or File depending on props. With simple v-file-input it might be array in some versions.
    // However the event argument 'file' passed here by @update:model-value might be what we want.
    // Safe handling:
    let f: File | null = null;
    
    if (Array.isArray(file) && file.length > 0) f = file[0];
    else if (file instanceof File) f = file;
    else if (file) f = file; // fallback

    if (!f) {
        imagePreview.value = null;
        imageFile.value = null;
        return;
    }
    
    imageFile.value = f;
    imagePreview.value = URL.createObjectURL(f);
}

const save = async () => {
    saving.value = true;
    try {
        const formData = new FormData();
        formData.append('name', editedItem.name);
        formData.append('unit_price', String(editedItem.unit_price));
        formData.append('qty', String(editedItem.qty));
        formData.append('description', editedItem.description || '');
        if (editedItem.category_id) formData.append('category_id', String(editedItem.category_id));
        if (editedItem.supplier_id) formData.append('supplier_id', String(editedItem.supplier_id));
        
        if (imageFile.value) {
            formData.append('image', imageFile.value);
        }

        if (editedIndex.value > -1) {
            // Update
            const { data } = await api.patch(`/products/${editedItem.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const productToUpdate = products.value[editedIndex.value];
            if (productToUpdate) {
                 Object.assign(productToUpdate, data);
            }
            showSnackbar('Product updated successfully');
        } else {
            // Create
            const { data } = await api.post('/products', formData, {
                 headers: { 'Content-Type': 'multipart/form-data' }
            });
            products.value.push(data);
             showSnackbar('Product created successfully');
        }
        closeDialog();
        // Refresh to ensure everything is synced (e.g. image URLs)
        fetchProducts(); 
    } catch (error) {
        console.error(error);
        showSnackbar('Operation failed', 'error');
    } finally {
        saving.value = false;
    }
};

const openStockDialog = (item: Product) => {
    Object.assign(stockItem, item);
    stockForm.product_id = item.id!;
    stockForm.quantity = 1;
    stockForm.stock_price = item.unit_price; // Default Cost to current price (or 0 if unknown)
    stockForm.sale_price = item.unit_price; // Default Sale to current price
    // Default to product's supplier if set
    stockForm.supplier_id = item.supplier_id || (item.supplier ? item.supplier.id : undefined);
    // If still undefined and we have suppliers, maybe default to first one? No, force selection.
    
    stockDialog.value = true;
};

const closeStockDialog = () => {
    stockDialog.value = false;
    setTimeout(() => {
         Object.assign(stockItem, defaultItem);
         stockForm.quantity = 1;
         stockForm.supplier_id = undefined;
    }, 300);
}

const saveStock = async () => {
    if (!stockForm.product_id) return;
    stockLoading.value = true;
    try {
        await api.post('/stocks/in', {
            product_id: stockForm.product_id,
            quantity: Number(stockForm.quantity),
            supplier_id: stockForm.supplier_id,
            stock_price: Number(stockForm.stock_price),
            sale_price: Number(stockForm.sale_price)
        });
        
        showSnackbar(`Stock added successfully for ${stockItem.name}`);
        closeStockDialog();
        fetchProducts(); // Refresh list to see new qty
    } catch (error) {
        console.error(error);
        showSnackbar('Failed to add stock', 'error');
    } finally {
        stockLoading.value = false;
    }
}

const showSnackbar = (text: string, color: string = 'success') => {
    snackbar.text = text;
    snackbar.color = color;
    snackbar.show = true;
}

onMounted(() => {
  fetchProducts();
  fetchDependencies();
});
</script>

<style scoped>
.product-table :deep(th) {
    font-weight: 600 !important;
    text-transform: uppercase;
    font-size: 0.85rem;
    color: #666;
}
</style>
