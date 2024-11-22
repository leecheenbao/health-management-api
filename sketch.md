health-management-api/
├── src/
│   ├── config/
│   │   ├── database.js      # 資料庫配置
│   │   └── config.js        # 其他配置項目
│   │
│   ├── models/              # 資料庫模型
│   │   ├── User.js         # 用戶模型
│   │   ├── HealthRecord.js # 健康記錄模型
│   │   ├── Exercise.js     # 運動記錄模型
│   │   ├── Diet.js         # 飲食記錄模型
│   │   └── index.js        # 模型整合
│   │
│   ├── routes/             # 路由配置
│   │   ├── userRoutes.js   # 用戶相關路由
│   │   ├── healthRoutes.js # 健康記錄路由
│   │   ├── exerciseRoutes.js # 運動相關路由
│   │   └── dietRoutes.js   # 飲食相關路由
│   │
│   │
│   ├── services/          # 業務邏輯
│   │   ├── userService.js
│   │   ├── healthService.js
│   │   ├── exerciseService.js
│   │   └── dietService.js
│   │
│   ├── middlewares/       # 中間件
│   │   ├── auth.js        # 認證中間件
│   │   ├── error.js       # 錯誤處理
│   │   └── validator.js   # 數據驗證
│   │
│   └── utils/            # 工具函數
│       ├── ApiError.js   # API錯誤類
│       └── logger.js     # 日誌工具
│
├── app.js              # 應用入口文件
├── .env                  # 環境變數
├── .gitignore           # Git忽略文件
├── package.json         # 項目依賴
├── sketch.md            # 項目筆記
└── README.md            # 項目說明

