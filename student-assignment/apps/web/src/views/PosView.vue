<template>
  <v-container fluid class="fill-height pa-0 bg-blue-grey-lighten-5">
    <!-- Product Grid Area (Main Content) -->
    <v-main class="fill-height">
      <v-container fluid class="pa-4 pa-md-6 h-100 d-flex flex-column">
         <!-- Header / Search -->
         <div class="pa-4 bg-white rounded-xl elevation-2 mb-6 d-flex flex-column flex-md-row align-center gap-4">
            <div class="d-flex flex-grow-1 w-100 gap-4">
                 <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="Search Products"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  bg-color="grey-lighten-5"
                  class="rounded-lg flex-grow-1"
                  color="primary"
                ></v-text-field>
                
                 <v-select
                   v-model="selectedCategory"
                   :items="categories"
                   item-title="name"
                   item-value="id"
                   label="Category"
                   variant="outlined"
                   density="comfortable"
                   hide-details
                   bg-color="grey-lighten-5"
                   clearable
                   class="rounded-lg"
                   style="max-width: 250px;"
                 ></v-select>
            </div>

            <v-btn
                color="primary"
                height="48"
                class="rounded-lg px-6 ml-md-4 mt-4 mt-md-0 w-100 w-md-auto font-weight-bold"
                elevation="3"
                @click="openCheckoutDialog"
            >
                <v-badge :content="cartItemCount" color="error" v-if="cartItemCount > 0" offset-x="10" offset-y="10">
                    <span class="mr-2">View Cart</span>
                    <v-icon icon="mdi-cart" size="large"></v-icon>
                </v-badge>
                <div v-else class="d-flex align-center">
                    <span class="mr-2">View Cart</span>
                    <v-icon icon="mdi-cart-outline" size="large"></v-icon>
                </div>
            </v-btn>
         </div>

        <!-- Product List -->
        <div class="flex-grow-1 overflow-y-auto pr-2 custom-scroll">
           <div v-if="loading" class="d-flex justify-center align-center fill-height">
              <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
           </div>

           <div v-else-if="filteredProducts.length === 0" class="d-flex flex-column align-center justify-center fill-height text-grey">
                <v-icon icon="mdi-package-variant-closed" size="100" class="mb-4 opacity-50"></v-icon>
                <div class="text-h5 font-weight-light">No products found</div>
           </div>
           
           <v-row v-else>
             <v-col 
                v-for="product in filteredProducts" 
                :key="product.id"
                cols="12" sm="6" md="4" lg="3" xl="2"
             >
               <v-card 
                class="h-100 rounded-xl hover-card d-flex flex-column border-0 elevation-3 overflow-hidden"
               >
                 <div class="position-relative">
                     <v-img
                      :src="product.image || 'https://via.placeholder.com/300?text=No+Image'"
                      height="200"
                      class="bg-white"
                      cover
                     >
                        <template v-slot:placeholder>
                            <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                                <v-icon icon="mdi-image-off" color="grey" size="large"></v-icon>
                            </div>
                        </template>
                     </v-img>
                     <v-chip
                        class="position-absolute top-0 right-0 ma-3 font-weight-bold elevation-2"
                        :color="product.qty > 0 ? 'white' : 'error'"
                        size="small"
                        label
                     >
                        <span v-if="product.qty > 0" class="text-black">{{ product.qty }} Left</span>
                        <span v-else>Out of Stock</span>
                    </v-chip>
                 </div>
                 
                 <v-card-text class="pa-4 d-flex flex-column flex-grow-1">
                    <div class="text-subtitle-1 font-weight-bold text-truncate mb-1">{{ product.name }}</div>
                     <div class="text-caption text-medium-emphasis mb-4">
                        {{ categories.find(c => c.id === product.category_id)?.name || 'General' }}
                    </div>
                    
                    <div class="mt-auto d-flex align-center justify-space-between">
                         <div class="text-h5 font-weight-bold text-primary">
                            ${{ Number(product.unit_price).toFixed(2) }}
                        </div>
                    </div>
                 </v-card-text>
                 
                 <v-card-actions class="pa-3 pt-0">
                    <v-btn
                        block
                        color="primary"
                        variant="flat"
                        size="large"
                        class="text-none font-weight-bold rounded-lg"
                        prepend-icon="mdi-cart-plus"
                        @click="addToCart(product)"
                        :disabled="product.qty <= 0"
                    >
                        Add to Cart
                    </v-btn>
                 </v-card-actions>
               </v-card>
             </v-col>
           </v-row>
        </div>
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top right">
      {{ snackbar.text }}
    </v-snackbar>
    
    <!-- Cart & Checkout Dialog -->
    <v-dialog v-model="checkoutDialog" max-width="900px" scrollable transition="dialog-bottom-transition">
        <v-card class="d-flex flex-column rounded-xl overflow-hidden bg-grey-lighten-5" height="700">
            <v-card-title class="pa-0">
                <v-toolbar color="primary" class="px-4">
                    <span class="text-h6 font-weight-bold">Shopping Cart</span>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" @click="checkoutDialog = false"></v-btn>
                </v-toolbar>
            </v-card-title>
            
            <v-card-text class="pa-0 d-flex flex-column flex-grow-1 overflow-hidden">
                <v-row no-gutters class="fill-height">
                    <!-- Left: Cart Items -->
                    <v-col cols="12" md="7" class="fill-height d-flex flex-column overflow-hidden bg-white">
                        <div v-if="cart.length === 0" class="d-flex flex-column align-center justify-center fill-height text-grey pa-4">
                            <v-icon icon="mdi-cart-off" size="96" class="mb-4 opacity-20"></v-icon>
                            <div class="text-h5 font-weight-light text-grey-darken-1">Your cart is empty</div>
                            <div class="text-caption mt-2">Add items from the product list to verify</div>
                        </div>
                        <div v-else class="fill-height d-flex flex-column">
                            <div class="d-flex justify-space-between align-center pa-4 border-b">
                                <span class="text-subtitle-2 text-medium-emphasis">{{ cart.length }} items in cart</span>
                                <v-btn 
                                    color="error" 
                                    variant="text" 
                                    size="small" 
                                    prepend-icon="mdi-delete-outline"
                                    @click="clearCart"
                                >
                                    Clear Cart
                                </v-btn>
                            </div>
                            <div class="flex-grow-1 overflow-y-auto pa-4 custom-scroll">
                                <v-card
                                    v-for="(item, index) in cart" 
                                    :key="item.product.id" 
                                    class="mb-3 border rounded-lg elevation-0 bg-grey-lighten-5"
                                >
                                    <div class="d-flex pa-3 align-center">
                                         <v-avatar rounded="lg" size="70" class="bg-white border me-4">
                                            <v-img :src="item.product.image || ''" cover></v-img>
                                        </v-avatar>
                                        
                                        <div class="flex-grow-1">
                                            <div class="text-subtitle-1 font-weight-bold text-truncate">{{ item.product.name }}</div>
                                            <div class="text-primary font-weight-bold">
                                                ${{ Number(item.price).toFixed(2) }}
                                            </div>
                                        </div>

                                        <div class="d-flex flex-column align-end gap-2">
                                            <div class="text-h6 font-weight-bold">
                                                 ${{ (item.price * item.quantity).toFixed(2) }}
                                            </div>
                                            <div class="d-flex align-center qty-pill bg-white px-1 rounded-pill border elevation-1">
                                                <v-btn icon="mdi-minus" size="x-small" variant="text" density="comfortable" @click="updateQty(index, -1)" color="grey-darken-2"></v-btn>
                                                <span class="px-3 text-body-2 font-weight-bold user-select-none" style="min-width: 30px; text-align: center;">{{ item.quantity }}</span>
                                                <v-btn icon="mdi-plus" size="x-small" variant="text" density="comfortable" @click="updateQty(index, 1)" color="primary"></v-btn>
                                            </div>
                                        </div>
                                        
                                        <v-btn icon="mdi-delete" color="error" variant="text" size="small" class="ml-2" @click="removeFromCart(index)"></v-btn>
                                    </div>
                                </v-card>
                            </div>
                        </div>
                    </v-col>
                    
                    <!-- Right: Payment & Summary -->
                    <v-col cols="12" md="5" class="bg-grey-lighten-5 pa-6 d-flex flex-column border-s">
                        <div class="text-h5 font-weight-bold mb-6">Order Summary</div>
                        
                        <v-card flat class="bg-white rounded-lg pa-4 mb-4 border">
                             <div class="d-flex justify-space-between mb-3">
                                 <span class="text-body-1 text-medium-emphasis">Subtotal</span>
                                 <span class="text-body-1 font-weight-bold">${{ cartTotal.toFixed(2) }}</span>
                            </div>
                            <!-- Potential Tax/Discount lines -->
                            <v-divider class="my-3 border-dashed"></v-divider>
                            <div class="d-flex justify-space-between align-end">
                                <span class="text-h6 font-weight-bold">Total</span>
                                <span class="text-h4 font-weight-bold text-primary">${{ cartTotal.toFixed(2) }}</span>
                            </div>
                        </v-card>
                        
                        <div class="mt-4">
                            <label class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-2 d-block">Payment Method</label>
                            <v-select
                                v-model="paymentMethod"
                                :items="['Cash', 'Credit Card', 'QR Scan']"
                                variant="outlined"
                                bg-color="white"
                                density="comfortable"
                                class="rounded-lg"
                                prepend-inner-icon="mdi-credit-card-outline"
                            ></v-select>
                        </div>
                        
                         <div v-if="paymentMethod === 'Cash'" class="mt-2">
                             <label class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-2 d-block">Cash Received</label>
                             <v-text-field
                                v-model.number="cashReceived"
                                type="number"
                                variant="outlined"
                                prefix="$"
                                bg-color="white"
                                density="comfortable"
                                class="rounded-lg"
                                :rules="[v => v >= cartTotal || 'Insufficient amount']"
                            ></v-text-field>
                        </div>
                        
                        <v-card v-if="paymentMethod === 'Cash' && cashReceived >= cartTotal" flat class="bg-green-lighten-5 pa-4 mt-2 mb-4 border-green rounded-lg d-flex justify-space-between align-center">
                            <span class="text-success font-weight-bold">Change Due</span>
                             <span class="text-h5 font-weight-bold text-success">${{ (cashReceived - cartTotal).toFixed(2) }}</span>
                        </v-card>
                        
                        <v-spacer></v-spacer>
                        
                        <v-btn 
                            block 
                            color="primary" 
                            size="x-large" 
                            variant="flat" 
                            @click="confirmCheckout" 
                            :loading="checkoutLoading" 
                            :disabled="cart.length === 0 || (paymentMethod === 'Cash' && cashReceived < cartTotal)"
                            class="mb-2 rounded-lg font-weight-bold"
                            height="60"
                        >
                            Confirm Payment
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '@/utils/axios';

// Interfaces
interface Category { id: number; name: string; }
interface Product {
    id: number; 
    name: string; 
    unit_price: number; 
    qty: number; 
    image?: string; 
    category_id: number;
}
interface CartItem {
    product: Product;
    quantity: number;
    price: number;
}

// State
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(false);
const search = ref('');
const selectedCategory = ref<number | null>(null);

const cart = ref<CartItem[]>([]);
const checkoutLoading = ref(false);
const checkoutDialog = ref(false);
const paymentMethod = ref('Cash');
const cashReceived = ref(0);

const snackbar = ref({
    show: false,
    text: '',
    color: 'success'
});

// Computed
const filteredProducts = computed(() => {
    return products.value.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.value.toLowerCase());
        const matchesCategory = !selectedCategory.value || p.category_id === selectedCategory.value;
        return matchesSearch && matchesCategory;
    });
});

const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const cartItemCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
});

// Methods
const fetchInitialData = async () => {
    loading.value = true;
    try {
        const [prodRes, catRes] = await Promise.all([
            api.get('/products'),
            api.get('/categories')
        ]);
        products.value = prodRes.data;
        categories.value = catRes.data;
    } catch (e) {
        showSnackbar('Failed to load products', 'error');
    } finally {
        loading.value = false;
    }
};

const addToCart = (product: Product) => {
    if (product.qty <= 0) {
        showSnackbar('Product out of stock', 'warning');
        return;
    }

    const existingIndex = cart.value.findIndex(item => item.product.id === product.id);
    
    if (existingIndex > -1) {
        const existingItem = cart.value[existingIndex];
        if (!existingItem) return;

        // Check stock limit
        if (existingItem.quantity >= product.qty) {
            showSnackbar('Not enough stock available', 'warning');
            return;
        }
        existingItem.quantity++;
    } else {
        cart.value.push({
            product: product,
            quantity: 1,
            price: Number(product.unit_price)
        });
    }
};

const updateQty = (index: number, change: number) => {
    const item = cart.value[index];
    if (!item) return;

    const newQty = item.quantity + change;
    
    if (newQty <= 0) {
        removeFromCart(index);
        return;
    }
    
    if (newQty > item.product.qty) {
        showSnackbar(`Only ${item.product.qty} in stock`, 'warning');
        return;
    }
    
    item.quantity = newQty;
};

const removeFromCart = (index: number) => {
    cart.value.splice(index, 1);
};

const clearCart = () => {
    cart.value = [];
};

const openCheckoutDialog = () => {
    // Allows opening even if empty to see empty state, or check
    if (cart.value.length === 0) {
        showSnackbar('Cart is empty', 'warning');
    }
    cashReceived.value = 0;
    paymentMethod.value = 'Cash';
    checkoutDialog.value = true;
};

const confirmCheckout = async () => {
    checkoutLoading.value = true;
    try {
        const payload = {
            items: cart.value.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity
            })),
            // In a real app, send payment details too
            // payment_method: paymentMethod.value
        };
        
        await api.post('/orders', payload);
        
        showSnackbar('Order completed successfully!', 'success');
        clearCart();
        fetchInitialData(); // Refresh stock levels
        checkoutDialog.value = false;
    } catch (error: any) {
        console.error(error);
        const errorMsg = error.response?.data?.message || 'Checkout failed';
        showSnackbar(errorMsg, 'error');
    } finally {
        checkoutLoading.value = false;
    }
};

const showSnackbar = (text: string, color: string = 'success') => {
    snackbar.value = { show: true, text, color };
};

onMounted(() => {
    fetchInitialData();
});
</script>

<style scoped>
.hover-card {
    transition: transform 0.2s, box-shadow 0.2s;
}
.hover-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.12) !important;
}

.qty-pill {
    min-width: 100px;
    justify-content: space-between;
}

.custom-scroll::-webkit-scrollbar {
    width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
    background-color: #e0e0e0;
    border-radius: 3px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #bdbdbd;
}

.gap-4 { gap: 16px; }
.gap-2 { gap: 8px; }

.border-green {
    border: 1px solid #4caf50 !important;
}
</style>
