# 資料庫操作

 - 建立資料庫

    ```bash
    npx sequelize-cli db:create
    ```

 - 創建 migration 檔案
    - 檔案名稱格式：YYYYMMDDHHMMSS-migration-name.js
    ```bash
    npx sequelize-cli migration:generate --name create-users-table
    ```

  - 遷移資料庫
    ```bash
    pnpm db:migrate
    ```

  - 創建測試資料檔案
    ```bash
    npx sequelize-cli seed:generate --name demo-data
    ```

  - 創建測試資料
    ```bash
    pnpm db:seed:all
    ```

  - 回滾資料庫

    ```bash
    npx sequelize-cli db:migrate:undo
    ```

  - 導出資料庫結構

    ```bash
    pnpm generate-schema
    ```

---