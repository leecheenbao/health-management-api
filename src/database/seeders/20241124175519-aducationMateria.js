'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. 先創建標籤
    const tags = [
      { name: '飲食' },
      { name: '心臟健康' },
      { name: '地中海飲食' },
      { name: '健康生活' },
      { name: '運動' },
      { name: '伸展' },
      { name: '居家運動' },
      { name: '體態改善' },
      { name: '冥想' },
      { name: '紓壓' },
      { name: '心理健康' },
      { name: '正念練習' }
    ];

    await queryInterface.bulkInsert('material_tags', tags, {});

    // 2. 創建衛教素材
    const materials = [
      {
        title: '健康飲食指南：地中海飲食法入門',
        content: '地中海飲食被公認為最健康的飲食方式之一。這種飲食方式強調：\n\n1. 大量攝取蔬菜水果\n2. 使用橄欖油作為主要油脂\n3. 適量攝取全穀物\n4. 以魚類作為主要蛋白質來源',
        primary_category: 'NUTRITION',
        image_url: 'https://example.com/images/mediterranean-diet.jpg',
        status: 'PUBLISHED',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: '居家運動系列：簡單伸展操',
        content: '每天花費10分鐘做伸展，可以有效改善身體柔軟度和預防痠痛。以下是基礎伸展動作：\n\n1. 肩頸伸展\n2. 腰部扭轉\n3. 臀部伸展\n4. 大腿前側伸展',
        primary_category: 'EXERCISE',
        video: 'https://example.com/videos/stretch-tutorial.mp4',
        status: 'PUBLISHED',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: '正念冥想：5分鐘紓壓練習',
        content: '這個5分鐘的正念冥想練習，幫助你在繁忙的生活中找到寧靜。練習重點：\n\n1. 專注呼吸\n2. 放鬆身體\n3. 清空雜念\n4. 覺察當下',
        primary_category: 'MENTAL_HEALTH',
        audio: 'https://example.com/audio/5min-meditation.mp3',
        status: 'PUBLISHED',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('educational_materials', materials, {});

    // // 3. 創建標籤關聯
    // const [materialTags, createdMaterials] = await Promise.all([
    //   queryInterface.sequelize.query(
    //     'SELECT id, name FROM material_tags;'
    //   ),
    //   queryInterface.sequelize.query(
    //     'SELECT id, title FROM educational_materials;'
    //   )
    // ]);

    // const tagRelations = [];
    
    // // 為第一篇文章添加標籤
    // const material1Tags = ['飲食', '心臟健康', '地中海飲食', '健康生活'];
    // material1Tags.forEach(tagName => {
    //   const tag = materialTags[0].find(t => t.name === tagName);
    //   if (tag) {
    //     tagRelations.push({
    //       material_id: createdMaterials[0][0].id,
    //       tag_id: tag.id
    //     });
    //   }
    // });

    // // 為第二篇文章添加標籤
    // const material2Tags = ['運動', '伸展', '居家運動', '體態改善'];
    // material2Tags.forEach(tagName => {
    //   const tag = materialTags[0].find(t => t.name === tagName);
    //   if (tag) {
    //     tagRelations.push({
    //       material_id: createdMaterials[0][1].id,
    //       tag_id: tag.id
    //     });
    //   }
    // });

    // // 為第三篇文章添加標籤
    // const material3Tags = ['冥想', '紓壓', '心理健康', '正念練習'];
    // material3Tags.forEach(tagName => {
    //   const tag = materialTags[0].find(t => t.name === tagName);
    //   if (tag) {
    //     tagRelations.push({
    //       material_id: createdMaterials[0][2].id,
    //       tag_id: tag.id
    //     });
    //   }
    // });

    // await queryInterface.bulkInsert('material_tag_relations', tagRelations, {});
  },

  async down(queryInterface, Sequelize) {
    // 按照相反的順序刪除數據
    // await queryInterface.bulkDelete('material_tag_relations', null, {});
    // await queryInterface.bulkDelete('educational_materials', null, {});
    await queryInterface.bulkDelete('material_tags', null, {});
  }
};
