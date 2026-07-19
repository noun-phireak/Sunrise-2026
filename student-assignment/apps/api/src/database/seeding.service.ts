import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Supplier } from './entities/supplier.entity';
import { Status } from './entities/status.entity';
import { User } from './entities/user.entity';
import { UserType } from './entities/user_type.entity';
import { Customer } from './entities/customer.entity';

@Injectable()
export class SeedingService implements OnModuleInit {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Supplier)
        private supplierRepository: Repository<Supplier>,
        @InjectRepository(Status)
        private statusRepository: Repository<Status>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserType)
        private userTypeRepository: Repository<UserType>,
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) { }

    async onModuleInit() {
        if (process.env.DISABLE_SEEDING === 'true') {
            console.log('Seeding is disabled.');
            return;
        }

        try {
            await this.seedCategories();
            await this.seedSuppliers();
            await this.seedUserTypes();
            await this.seedStatuses();
            await this.seedWalkInCustomer();
            await this.seedAdminUser();
        } catch (error: any) {
            if (error?.message?.includes('does not exist')) {
                console.warn('⚠️  WARNING: Database tables do not exist yet. Skipping seeding.');
                console.warn('   Run migrations to create tables: npm run migration:run');
            } else {
                throw error;
            }
        }
    }

    private async seedCategories() {
        const count = await this.categoryRepository.count();
        if (count > 0) return;

        console.log('Seeding Categories...');
        const categories = [
            { name: 'Beverages', description: 'Drinks and liquids', icon: '🥤' },
            { name: 'Groceries', description: 'Daily essentials', icon: '🛒' },
        ];

        await this.categoryRepository.save(categories);
        console.log('Categories seeded.');
    }

    private async seedSuppliers() {
        const count = await this.supplierRepository.count();
        if (count > 0) return;

        console.log('Suppliers seeded.');
    }

    private async seedUserTypes() {
        const count = await this.userTypeRepository.count();
        if (count > 0) return;

        console.log('Seeding User Types...');
        const types = [
            { name: 'Admin' },
            { name: 'Cashier' },
            { name: 'Customer' },
        ];
        await this.userTypeRepository.save(types);
        console.log('User Types seeded.');
    }

    private async seedStatuses() {
        const count = await this.statusRepository.count();
        if (count > 0) return;

        console.log('Seeding Statuses...');
        const statuses = [
            { name: 'Pending', color: '#ff9800' },
            { name: 'Completed', color: '#4caf50' },
            { name: 'Cancelled', color: '#f44336' },
        ];
        await this.statusRepository.save(statuses);
        console.log('Statuses seeded.');
    }

    private async seedWalkInCustomer() {
        const userType = await this.userTypeRepository.findOneBy({ name: 'Customer' });
        if (!userType) return;

        const existingCustomer = await this.userRepository.findOneBy({ email: 'walkin@pos.com' });
        if (existingCustomer) return;

        console.log('Seeding Walk-in Customer...');

        // Create User
        const user = new User();
        user.name = 'Walk-in Customer';
        user.email = 'walkin@pos.com';
        user.password = '$2b$10$EpIxT98hT.y/d8t1b3h9U.W8t1b3h9U.W8t1b3h9U.W8t1b3h9U.'; // Dummy hash
        user.type = userType;
        user.is_email_verified = true;

        const savedUser = await this.userRepository.save(user);

        // Create Customer
        const customer = new Customer();
        customer.user = savedUser;
        customer.address = 'N/A';

        await this.customerRepository.save(customer);
        console.log('Walk-in Customer seeded.');
    }

    private async seedAdminUser() {
        const userType = await this.userTypeRepository.findOneBy({ name: 'Admin' });
        if (!userType) return;

        const existingAdmin = await this.userRepository.findOneBy({ email: 'admin@pos.com' });
        if (existingAdmin) return;

        console.log('Seeding Admin User...');

        const user = new User();
        user.name = 'Super Admin';
        user.email = 'admin@pos.com';
        user.password = '$2b$10$EpIxT98hT.y/d8t1b3h9U.W8t1b3h9U.W8t1b3h9U.W8t1b3h9U.'; // 'password'
        user.type = userType;
        user.is_email_verified = true;

        await this.userRepository.save(user);
        console.log('Admin User seeded.');
    }
}
