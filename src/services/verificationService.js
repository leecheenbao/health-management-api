const { MedicationBatch } = require('../models');
const logger = require('../utils/logger');
const { uploadToGCS } = require('../utils/cloudStorage');
// const { scanBarcode } = require('../utils/barcodeScanner');

class VerificationService {
    /**
     * 上傳藥盒照片並解析條碼
     * @param {Object} file - 上傳的文件
     * @param {number} userId - 用戶ID
     */
    async uploadMedicationImage(file, userId) {
        try {
            // 上傳圖片到 S3
            const imageUrl = await uploadToGCS(file);

            // 掃描條碼
            // const { barcode, batchNumber } = await scanBarcode(file.buffer);

            // 創建批號記錄
            const batch = await MedicationBatch.create({
                user_id: userId,
                batch_number: batchNumber,
                barcode,
                image_url: imageUrl
            });

            return batch;
        } catch (error) {
            logger.error('藥盒照片上傳失敗:', error);
            throw error;
        }
    }

    /**
     * 批量添加藥品批號
     * @param {Array} batchNumbers - 批號數組
     * @param {number} userId - 用戶ID
     */
    async addBatchNumbers(batchNumbers, userId) {
        try {
            const batches = await MedicationBatch.bulkCreate(
                batchNumbers.map(number => ({
                    user_id: userId,
                    batch_number: number
                }))
            );

            return batches;
        } catch (error) {
            logger.error('批量添加藥品批號失敗:', error);
            throw error;
        }
    }

    /**
     * 驗證藥品批號
     * @param {string} batchNumber - 批號
     * @param {number} userId - 用戶ID
     */
    async verifyBatchNumber(batchNumber, userId) {
        try {
            const batch = await MedicationBatch.findOne({
                where: {
                    batch_number: batchNumber,
                    user_id: userId
                }
            });

            if (!batch) {
                throw new Error('無效的藥品批號');
            }

            await batch.update({
                is_verified: true,
                verified_at: new Date()
            });

            return batch;
        } catch (error) {
            logger.error('藥品批號驗證失敗:', error);
            throw error;
        }
    }

    /**
     * 獲取用戶的驗證狀態
     * @param {number} userId - 用戶ID
     */
    async getVerificationStatus(userId) {
        try {
            const batches = await MedicationBatch.findAll({
                where: { user_id: userId },
                order: [['created_at', 'DESC']]
            });

            const verifiedCount = batches.filter(b => b.is_verified).length;
            const isFullyVerified = verifiedCount >= 6;

            return {
                totalBatches: batches.length,
                verifiedBatches: verifiedCount,
                isFullyVerified,
                batches
            };
        } catch (error) {
            logger.error('獲取驗證狀態失敗:', error);
            throw error;
        }
    }
}

module.exports = new VerificationService(); 