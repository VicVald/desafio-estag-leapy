module.exports = (router, context) => {
  const { database, logger } = context;

  router.get('/talents', async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sort = '-date_updated',
        department,
        current_status,
        pdi_plan_ready,
        orchestrator_state,
        start_date_gte,
        start_date_lte,
        end_date_gte,
        end_date_lte,
        leader_id,
        target_role_id
      } = req.query;

      // Convert page and limit to numbers
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const offset = (pageNum - 1) * limitNum;

      // Build the base query with joins
      let query = database
        .select([
          't.*',
          'u.email as user_email',
          'l.user_id as leader_user_id',
          'lu.email as leader_email',
          'tr.name as target_role_name'
        ])
        .from('talents as t')
        .leftJoin('directus_users as u', 't.user_id', 'u.id')
        .leftJoin('internship_leaders as l', 't.leader_id', 'l.id')
        .leftJoin('directus_users as lu', 'l.user_id', 'lu.id')
        .leftJoin('target_roles as tr', 't.target_role_id', 'tr.id')
        .whereNull('t.date_deleted');

      // Apply filters
      if (department) {
        query = query.where('t.department', department);
      }

      if (current_status) {
        query = query.where('t.current_status', current_status);
      }

      if (pdi_plan_ready !== undefined) {
        const pdiReady = pdi_plan_ready === 'true';
        query = query.where('t.pdi_plan_ready', pdiReady);
      }

      if (orchestrator_state) {
        query = query.where('t.orchestrator_state', orchestrator_state);
      }

      if (start_date_gte) {
        query = query.where('t.start_date', '>=', start_date_gte);
      }

      if (start_date_lte) {
        query = query.where('t.start_date', '<=', start_date_lte);
      }

      if (end_date_gte) {
        query = query.where('t.end_date', '>=', end_date_gte);
      }

      if (end_date_lte) {
        query = query.where('t.end_date', '<=', end_date_lte);
      }

      if (leader_id) {
        query = query.where('t.leader_id', parseInt(leader_id, 10));
      }

      if (target_role_id) {
        query = query.where('t.target_role_id', parseInt(target_role_id, 10));
      }

      // Apply search (by email)
      if (search) {
        query = query.where('u.email', 'ilike', `%${search}%`);
      }

      // Get total count for pagination
      const countQuery = query.clone().clearSelect().count('* as total').first();
      const countResult = await countQuery;
      const total = parseInt(countResult.total, 10);

      // Apply sorting
      let orderByField = 't.date_updated';
      let orderByDirection = 'desc';

      if (sort) {
        switch (sort) {
          case '':
            orderByField = 't.date_updated';
            orderByDirection = 'desc';
            break;
          case 'date_updated':
            orderByField = 't.date_updated';
            orderByDirection = 'asc';
            break;
          case 'old_start_date':
            orderByField = 't.start_date';
            orderByDirection = 'asc';
            break;
          case 'new_start_date':
            orderByField = 't.start_date';
            orderByDirection = 'desc';
            break;
          case 'end_date':
            orderByField = 't.end_date';
            orderByDirection = 'asc';
            break;
          default:
            // Default to date_updated desc if invalid sort option
            break;
        }
      }

      query = query.orderBy(orderByField, orderByDirection);

      // Apply pagination
      query = query.limit(limitNum).offset(offset);

      // Execute query
      const talents = await query;

      // Calculate pagination info
      const totalPages = Math.ceil(total / limitNum);
      const hasNext = pageNum < totalPages;
      const hasPrev = pageNum > 1;

      res.json({
        data: talents,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext,
          hasPrev
        }
      });

    } catch (error) {
      logger.error('Error fetching talents:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  });
};