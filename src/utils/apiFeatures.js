export class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    const queryObj = { ...this.queryString }
    const excludedFields = ["page", "sort", "limit", "fields", "q", "populate"]
    excludedFields.forEach((el) => delete queryObj[el])

    // Xử lý các toán tử so sánh
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq|ne|in)\b/g, (match) => `$${match}`)

    this.query = this.query.find(JSON.parse(queryStr))

    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ")
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort("-createdAt")
    }

    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ")
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select("-__v")
    }

    return this
  }

  paginate() {
    const page = Number.parseInt(this.queryString.page, 10) || 1
    const limit = Number.parseInt(this.queryString.limit, 10) || 10
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }

  search() {
    if (this.queryString.q) {
      const searchTerm = this.queryString.q

      // Giả sử model có thuộc tính searchableFields
      const searchQuery = {
        $or: [{ name: { $regex: searchTerm, $options: "i" } }, { description: { $regex: searchTerm, $options: "i" } }],
      }

      this.query = this.query.find(searchQuery)
    }

    return this
  }

  populate() {
    if (this.queryString.populate) {
      const fields = this.queryString.populate.split(",")
      fields.forEach((field) => {
        this.query = this.query.populate(field)
      })
    }

    return this
  }
}

