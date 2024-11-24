const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const educationalMaterialService = require('../services/educationalMaterialService');
const asyncHandler = require('../middlewares/asyncHandler');
const pagination = require('../middlewares/pagination');

/**
 * @api {get} /api/v1/materials 獲取所有衛教素材
 * @apiName GetMaterials
 * @apiGroup 03.衛教素材模組
 */
router.get('/', 
    authenticateToken,
    pagination(),
    asyncHandler(
        async (req, res) => {
            const materials = await educationalMaterialService.getMaterials(req.query);
            res.paginate(materials.records, materials.total);
        }
    )
);

/**
 * @api {get} /api/v1/materials/:id 獲取特定衛教素材
 * @apiName GetMaterial
 * @apiGroup 03.衛教素材模組
 */
router.get('/:id',
    authenticateToken,
    asyncHandler(
        async (req, res) => {
            const material = await educationalMaterialService.getMaterialById(req.params.id);
            res.json(material);
        }
    )
);

/**
 * @api {get} /api/v1/materials/category/:category 獲取特定類別的衛教素材
 * @apiName GetMaterialsByCategory
 * @apiGroup 03.衛教素材模組
 */
router.get('/category/:category',
    authenticateToken,
    asyncHandler(
        async (req, res) => {
            const materials = await educationalMaterialService.getMaterialsByCategory(req.params.category);
            res.json(materials);
        }
    )
);

/**
 * @api {get} /api/v1/materials/tag/:tagName 獲取特定標籤的衛教素材
 * @apiName GetMaterialsByTag
 * @apiGroup 03.衛教素材模組
 */
router.get('/tag/:tagName',
    authenticateToken,
    asyncHandler(
        async (req, res) => {
            const materials = await educationalMaterialService.getMaterialsByTag(req.params.tagName);
            res.json(materials);
        }
    )
);

/**
 * @api {post} /api/v1/materials 創建衛教素材
 * @apiName CreateMaterial
 * @apiGroup 03.衛教素材模組
 * @apiParam {String[]} tags 標籤名稱陣列
 * @apiParam {String} title 標題
 * @apiParam {String} content 內容
 * @apiParam {String} primary_category 主類別
 * @apiParam {String} secondary_category 次類別
 * @apiParam {String} image_url 圖片
 * @apiParam {String} video_url 影片
 */
router.post('/',
    authenticateToken,
    asyncHandler(
        async (req, res) => {
            const material = await educationalMaterialService.createMaterial(req.body);
            res.json(material);
        }
    )
);

/**
 * @api {put} /api/v1/materials/:id 更新衛教素材
 * @apiName UpdateMaterial
 * @apiGroup 03.衛教素材模組
 * @apiParam {String[]} tags 標籤名稱陣列
 * @apiParam {String} title 標題
 * @apiParam {String} content 內容
 * @apiParam {String} primary_category 主類別
 * @apiParam {String} secondary_category 次類別
 * @apiParam {String} image_url 圖片
 * @apiParam {String} video_url 影片
 */
router.put('/:id',
    authenticateToken,
    asyncHandler(
        async (req, res) => {
            const material = await educationalMaterialService.updateMaterial(req.params.id, req.body);
            res.json(material);
        }
    )
);

/**
 * @api {delete} /api/v1/materials/:id 刪除衛教素材
 * @apiName DeleteMaterial
 * @apiGroup 03.衛教素材模組
 */
router.delete('/:id',
    authenticateToken,
    asyncHandler(
        async (req, res) => {
            const material = await educationalMaterialService.deleteMaterial(req.params.id);
            res.json(material);
        }
    )
);

/**
 * @api {post} /api/v1/materials/:id/like 喜歡衛教素材
 * @apiName LikeMaterial
 * @apiGroup 03.衛教素材模組
 */
router.post('/:id/like',
    authenticateToken,
    asyncHandler(
        async (req, res) => {
            const material = await educationalMaterialService.likeMaterial(req.params.id);
            res.json(material);
        }
    )
); 

module.exports = router;