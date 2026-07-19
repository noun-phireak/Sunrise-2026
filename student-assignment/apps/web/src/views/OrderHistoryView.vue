<template>
  <v-container fluid class="fill-height bg-grey-lighten-4 pa-4">
    <v-card class="w-100 h-100 rounded-lg elevation-2 d-flex flex-column">
        <v-card-title class="pa-4 d-flex align-center justify-space-between border-b">
            <div class="d-flex align-center">
                <v-icon icon="mdi-history" color="primary" class="mr-2"></v-icon>
                <span class="text-h6 font-weight-bold">Order History</span>
            </div>
            <v-btn icon="mdi-refresh" variant="text" @click="fetchOrders" :loading="loading"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-0 flex-grow-1 overflow-hidden">
             <v-data-table
                :headers="headers"
                :items="orders"
                :loading="loading"
                fixed-header
                height="100%"
                hover
                class="fill-height"
             >
                <template v-slot:item.id="{ item }">
                    <span class="font-weight-bold">#{{ item.id }}</span>
                </template>
                
                <template v-slot:item.created_at="{ item }">
                    {{ new Date(item.created_at).toLocaleString() }}
                </template>
                
                <template v-slot:item.total_price="{ item }">
                    <span class="text-primary font-weight-bold">${{ Number(item.total_price).toFixed(2) }}</span>
                </template>
                
                <template v-slot:item.cashier="{ item }">
                    <div class="d-flex align-center">
                        <v-avatar size="24" color="primary" class="mr-2 text-caption text-white">
                            {{ item.cashier?.name?.charAt(0) || '?' }}
                        </v-avatar>
                        {{ item.cashier?.name || 'Unknown' }}
                    </div>
                </template>
                
                <template v-slot:item.status="{ item }">
                    <v-chip
                        :color="getStatusColor(item.status?.name)"
                        size="small"
                        class="font-weight-bold"
                    >
                        {{ item.status?.name || 'Completed' }}
                    </v-chip>
                </template>
                
                 <template v-slot:item.actions="{ item }">
                    <v-btn icon="mdi-eye" size="small" variant="text" color="grey" @click="viewDetails(item)"></v-btn>
                </template>
             </v-data-table>
        </v-card-text>
    </v-card>
    
    <!-- Order Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="600px">
        <v-card v-if="selectedOrder">
            <v-card-title class="bg-primary text-white d-flex justify-space-between align-center pa-4">
                <span>Order #{{ selectedOrder.id }} Details</span>
                <v-btn icon="mdi-close" variant="text" color="white" @click="detailsDialog = false"></v-btn>
            </v-card-title>
            <v-card-text class="pa-4">
                <div class="d-flex justify-space-between mb-4 text-subtitle-1">
                    <span><strong>Date:</strong> {{ new Date(selectedOrder.created_at).toLocaleString() }}</span>
                    <span><strong>Cashier:</strong> {{ selectedOrder.cashier?.name || 'Unknown' }}</span>
                </div>
                
                <v-divider class="mb-4"></v-divider>
                
                <v-list lines="one" density="compact" class="border rounded mb-4">
                    <v-list-item v-for="detail in selectedOrder.details" :key="detail.id">
                        <template v-slot:prepend>
                             <v-avatar rounded size="40" class="bg-grey-lighten-4 border mr-3">
                                <v-img :src="detail.product?.image || ''" contain></v-img>
                             </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-medium">{{ detail.product?.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                            {{ detail.qty }} x ${{ Number(detail.unit_price).toFixed(2) }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                            <span class="font-weight-bold">${{ (detail.qty * detail.unit_price).toFixed(2) }}</span>
                        </template>
                    </v-list-item>
                </v-list>
                
                <div class="d-flex justify-end text-h5 font-weight-bold">
                    Total: <span class="text-primary ml-2">${{ Number(selectedOrder.total_price).toFixed(2) }}</span>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/utils/axios';

const orders = ref<any[]>([]);
const loading = ref(false);
const detailsDialog = ref(false);
const selectedOrder = ref<any>(null);

const headers = [
    { title: 'Order ID', key: 'id', align: 'start' as const },
    { title: 'Date', key: 'created_at', align: 'start' as const },
    { title: 'Cashier', key: 'cashier', align: 'start' as const },
    { title: 'Status', key: 'status', align: 'center' as const },
    { title: 'Total', key: 'total_price', align: 'end' as const },
    { title: 'Actions', key: 'actions', align: 'end' as const, sortable: false },
];

const fetchOrders = async () => {
    loading.value = true;
    try {
        const response = await api.get('/orders');
        orders.value = response.data;
    } catch (error) {
        console.error('Failed to fetch orders', error);
    } finally {
        loading.value = false;
    }
};

const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
        case 'completed': return 'success';
        case 'pending': return 'warning';
        case 'cancelled': return 'error';
        default: return 'grey';
    }
};

const viewDetails = (order: any) => {
    selectedOrder.value = order;
    detailsDialog.value = true;
};

onMounted(() => {
    fetchOrders();
});
</script>
