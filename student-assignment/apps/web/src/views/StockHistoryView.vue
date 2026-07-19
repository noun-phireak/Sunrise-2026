<template>
  <v-container fluid class="fill-height bg-grey-lighten-4 pa-4">
    <v-card class="w-100 h-100 rounded-lg elevation-2 d-flex flex-column">
        <v-card-title class="pa-4 d-flex align-center justify-space-between border-b">
            <div class="d-flex align-center">
                <v-icon icon="mdi-clipboard-list" color="primary" class="mr-2"></v-icon>
                <span class="text-h6 font-weight-bold">Stock History (Purchase Orders)</span>
            </div>
            <v-btn icon="mdi-refresh" variant="text" @click="fetchStockHistory" :loading="loading"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-0 flex-grow-1 overflow-hidden">
             <v-data-table
                :headers="headers"
                :items="history"
                :loading="loading"
                fixed-header
                height="100%"
                hover
                class="fill-height"
             >
                <template v-slot:item.id="{ item }">
                    <span class="font-weight-bold">#{{ item.id }}</span>
                </template>
                
                <template v-slot:item.code="{ item }">
                    <v-chip size="small" variant="outlined">{{ item.code }}</v-chip>
                </template>
                
                <template v-slot:item.requested_at="{ item }">
                    {{ new Date(item.requested_at).toLocaleString() }}
                </template>
                
                <template v-slot:item.supplier="{ item }">
                    <div class="d-flex align-center">
                        <v-icon icon="mdi-truck-delivery" size="small" class="mr-2 text-grey"></v-icon>
                        {{ item.supplier?.name || 'Unknown' }}
                    </div>
                </template>
                
                <template v-slot:item.stocker="{ item }">
                    <v-avatar size="24" color="secondary" class="mr-2 text-caption text-white">
                        {{ item.stocker?.name?.charAt(0) || '?' }}
                    </v-avatar>
                    {{ item.stocker?.name || 'Unknown' }}
                </template>
                
                <template v-slot:item.stock_price="{ item }">
                    <span class="text-brown">{{ item.stock_price ? `$${Number(item.stock_price).toFixed(2)}` : '-' }}</span>
                </template>
                <template v-slot:item.sale_price="{ item }">
                    <span class="text-blue">{{ item.sale_price ? `$${Number(item.sale_price).toFixed(2)}` : '-' }}</span>
                </template>
                <template v-slot:item.total_price="{ item }">
                    <span class="text-success font-weight-bold">${{ Number(item.total_price).toFixed(2) }}</span>
                </template>
                <template v-slot:item.status="{ item }">
                    <v-chip
                        :color="getStatusColor(item.status?.name)"
                        size="small"
                        class="font-weight-bold"
                    >
                        {{ item.status?.name || 'Unknown' }}
                    </v-chip>
                </template>

                 <template v-slot:item.actions="{ item }">
                    <div class="d-flex ga-2" v-if="item.status?.name === 'Pending' && authStore.isAdmin">
                        <v-btn 
                            color="success" 
                            size="small" 
                            variant="flat" 
                            prepend-icon="mdi-check"
                            @click="approveStock(item)"
                            :loading="approving === item.id"
                        >
                            Approve
                        </v-btn>
                        <v-btn 
                            color="error" 
                            size="small" 
                            variant="flat" 
                            prepend-icon="mdi-close"
                            @click="rejectStock(item)"
                            :loading="rejecting === item.id"
                        >
                            Reject
                        </v-btn>
                    </div>
                </template>
             </v-data-table>
        </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/utils/axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const history = ref<any[]>([]);
const loading = ref(false);
const approving = ref<number | null>(null);
const rejecting = ref<number | null>(null);

const headers = [
    { title: 'ID', key: 'id', align: 'start' as const },
    { title: 'Code', key: 'code', align: 'start' as const },
    { title: 'Date', key: 'requested_at', align: 'start' as const },
    { title: 'Supplier', key: 'supplier', align: 'start' as const },
    { title: 'Stocker', key: 'stocker', align: 'start' as const },
    { title: 'Stock Price', key: 'stock_price', align: 'end' as const },
    { title: 'Sale Price', key: 'sale_price', align: 'end' as const },
    { title: 'Status', key: 'status', align: 'center' as const },
    { title: 'Total Cost', key: 'total_price', align: 'end' as const },
    { title: 'Actions', key: 'actions', align: 'end' as const, sortable: false },
];

const fetchStockHistory = async () => {
    loading.value = true;
    try {
        const response = await api.get('/stocks');
        history.value = response.data;
    } catch (error) {
        console.error('Failed to fetch stock history', error);
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

const approveStock = async (item: any) => {
    approving.value = item.id;
    try {
        await api.post(`/stocks/${item.id}/approve`);
        // Refresh list
        await fetchStockHistory();
    } catch (error) {
        console.error('Failed to approve stock', error);
         // You might want to add a snackbar here, but for now console log is enough as per previous pattern
    } finally {
        approving.value = null;
    }
};

const rejectStock = async (item: any) => {
    rejecting.value = item.id;
    try {
        await api.post(`/stocks/${item.id}/reject`);
        // Refresh list
        await fetchStockHistory();
    } catch (error) {
        console.error('Failed to reject stock', error);
    } finally {
        rejecting.value = null;
    }
};

onMounted(() => {
    fetchStockHistory();
});
</script>
