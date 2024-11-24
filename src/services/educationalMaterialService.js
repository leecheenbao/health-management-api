const { EducationalMaterial, MaterialTag, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class EducationalMaterialService {
    /**
     * 獲取所有衛教素材
     */
    async getMaterials(query = {}) {
        try {
            const { 
                page = 1, 
                limit = 10, 
                category,
                tag,
                search 
            } = query;

            const where = { is_active: true };
            
            if (category) {
                where.primary_category = category;
            }

            const include = [{
                model: MaterialTag,
                as: 'tags',
                through: { attributes: [] }
            }];

            if (tag) {
                include[0].where = { name: tag };
            }

            if (search) {
                where[Op.or] = [
                    { title: { [Op.like]: `%${search}%` } },
                    { content: { [Op.like]: `%${search}%` } }
                ];
            }

            const materials = await EducationalMaterial.findAndCountAll({
                where,
                include,
                limit: parseInt(limit),
                offset: (page - 1) * limit,
                order: [['published_at', 'DESC']],
                distinct: true
            });

            return {
                materials: materials.rows,
                total: materials.count,
                page: parseInt(page),
                totalPages: Math.ceil(materials.count / limit)
            };
        } catch (error) {
            logger.error('獲取衛教素材失敗:', error);
            throw error;
        }
    }

    /**
     * 獲取特定衛教素材
     */
    async getMaterialById(id) {
        try {
            const material = await EducationalMaterial.findOne({
                where: { id, is_active: true },
                include: [{
                    model: MaterialTag,
                    as: 'tags',
                    through: { attributes: [] }
                }]
            });

            if (!material) {
                throw ApiError.notFound('衛教素材不存在');
            }

            // 增加瀏覽次數
            await material.increment('view_count');

            return material;
        } catch (error) {
            logger.error('獲取衛教素材失敗:', error);
            throw error;
        }
    }

    /**
     * 創建衛教素材
     */
    async createMaterial(materialData, tagNames = []) {
        const transaction = await sequelize.transaction();

        try {
            const material = await EducationalMaterial.create(materialData, {
                transaction
            });

            if (tagNames.length > 0) {
                const tags = await Promise.all(
                    tagNames.map(name => 
                        MaterialTag.findOrCreate({
                            where: { name },
                            transaction
                        })
                    )
                );

                await material.setTags(
                    tags.map(([tag]) => tag),
                    { transaction }
                );
            }

            await transaction.commit();
            return material;

        } catch (error) {
            await transaction.rollback();
            logger.error('創建衛教素材失敗:', error);
            throw error;
        }
    }

    /**
     * 更新衛教素材
     */
    async updateMaterial(id, updateData, tagNames) {
        const transaction = await sequelize.transaction();

        try {
            const material = await EducationalMaterial.findByPk(id);
            
            if (!material) {
                throw ApiError.notFound('衛教素材不存在');
            }

            await material.update(updateData, { transaction });

            if (tagNames) {
                const tags = await Promise.all(
                    tagNames.map(name => 
                        MaterialTag.findOrCreate({
                            where: { name },
                            transaction
                        })
                    )
                );

                await material.setTags(
                    tags.map(([tag]) => tag),
                    { transaction }
                );
            }

            await transaction.commit();
            return material;

        } catch (error) {
            await transaction.rollback();
            logger.error('更新衛教素材失敗:', error);
            throw error;
        }
    }

    /**
     * 刪除衛教素材
     */
    async deleteMaterial(id) {
        try {
            const material = await EducationalMaterial.findByPk(id);
            
            if (!material) {
                throw ApiError.notFound('衛教素材不存在');
            }

            await material.update({ is_active: false });
            return { success: true, message: '衛教素材已刪除' };

        } catch (error) {
            logger.error('刪除衛教素材失敗:', error);
            throw error;
        }
    }

    /**
     * 喜歡衛教素材
     */
    async likeMaterial(id) {
        try {
            const material = await EducationalMaterial.findByPk(id);
            
            if (!material) {
                throw ApiError.notFound('衛教素材不存在');
            }

            await material.increment('likes_count');
            return { success: true, message: '已喜歡此衛教素材' };

        } catch (error) {
            logger.error('喜歡衛教素材失敗:', error);
            throw error;
        }
    }
}

module.exports = new EducationalMaterialService();