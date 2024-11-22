'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 插入用戶數據
        const users = await queryInterface.bulkInsert('users', [
            {
                name: '測試用戶1',
                email: 'test1@example.com',
                hospital: '台北醫院',
                doctor_name: '王大明',
                phone: '0912345678',
                is_active: true,
                privacy_agreed: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: '測試用戶2',
                email: 'test2@example.com',
                hospital: '台中醫院',
                doctor_name: '李小華',
                phone: '0923456789',
                is_active: true,
                privacy_agreed: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], { returning: true });

        // 插入衛教素材數據
        const materials = await queryInterface.bulkInsert('educational_materials', [
            {
                primary_category: '用藥指南',
                secondary_category: '注意事項',
                title: '正確用藥須知',
                content: '詳細的用藥說明...',
                view_count: 0,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                primary_category: '生活指導',
                secondary_category: '飲食建議',
                title: '健康飲食指南',
                content: '均衡飲食的重要性...',
                view_count: 0,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], { returning: true });

        // 插入素材標籤
        const tags = await queryInterface.bulkInsert('material_tags', [
            { name: '用藥安全' },
            { name: '飲食建議' },
            { name: '生活習慣' }
        ], { returning: true });

        // 插入提醒設置
        await queryInterface.bulkInsert('reminders', [
            {
                user_id: 1,
                type: 'MEDICATION',
                reminder_date: new Date(),
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                user_id: 1,
                type: 'FOLLOW_UP',
                reminder_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天後
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // 插入藥品驗證記錄
        await queryInterface.bulkInsert('medicine_verifications', [
            {
                user_id: 1,
                medicine_code: 'MED001',
                box_photo_url: 'https://example.com/photo1.jpg',
                verified_at: new Date(),
                created_at: new Date()
            }
        ]);

        // 插入登入記錄
        await queryInterface.bulkInsert('login_records', [
            {
                user_id: 1,
                login_at: new Date()
            },
            {
                user_id: 2,
                login_at: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        // 按照相反的順序刪除數據
        await queryInterface.bulkDelete('login_records', null, {});
        await queryInterface.bulkDelete('medicine_verifications', null, {});
        await queryInterface.bulkDelete('reminders', null, {});
        await queryInterface.bulkDelete('material_tag_relations', null, {});
        await queryInterface.bulkDelete('material_tags', null, {});
        await queryInterface.bulkDelete('educational_materials', null, {});
        await queryInterface.bulkDelete('users', null, {});
    }
}; 