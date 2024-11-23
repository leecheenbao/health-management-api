const pagination = (options = {}) => {
  const defaultOptions = {
    defaultLimit: 10,
    maxLimit: 100
  };

  const finalOptions = { ...defaultOptions, ...options };

  return (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      let limit = parseInt(req.query.limit) || finalOptions.defaultLimit;
      limit = Math.min(limit, finalOptions.maxLimit);
      
      const offset = (page - 1) * limit;

      req.pagination = { page, limit, offset };

      res.paginate = (data, total) => {
        const totalPages = Math.ceil(total / limit);
        return res.json({
          status: 'success',
          data,
          pagination: {
            total,
            total_pages: totalPages,
            current_page: page,
            per_page: limit,
            has_next: page < totalPages,
            has_prev: page > 1
          }
        });
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = pagination; 