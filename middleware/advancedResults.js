const advancedResults = (module, populate) => async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  //Fields to exclude

  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over removeFields and delte them from reqQuery

  removeFields.forEach((param) => delete reqQuery[param]);
  let queryStr = JSON.stringify(reqQuery);

  console.log("requery", reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  //findin resource
  query = module.find(JSON.parse(queryStr));

  //select fields

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // sort
  if (req.query.sort) {
    const sortBy = req.query.select.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await module.countDocuments();

  query = query.skip(startIndex).limit(limit);
  if (populate) {
    query = query.populate(populate);
  }
  console.log(queryStr);
  //execute the query
  const results = await query;
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
