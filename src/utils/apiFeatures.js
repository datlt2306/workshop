export class APIFeatures {
    constructor(model, queryString) {
        this.model = model;
        this.queryString = queryString;
        this.filterObj = {};
        this.options = {
            page: Number.parseInt(this.queryString.page, 10) || 1,
            limit: Number.parseInt(this.queryString.limit, 10) || 10,
            sort: "-createdAt",
            select: "-__v",
            populate: [],
        };
        this._conditions = {};
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields", "q", "populate"];
        excludedFields.forEach((el) => delete queryObj[el]);

        // Xử lý các toán tử so sánh
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq|ne|in)\b/g, (match) => `$${match}`);

        this._conditions = { ...this._conditions, ...JSON.parse(queryStr) };

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            this.options.sort = this.queryString.sort.split(",").join(" ");
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            this.options.select = this.queryString.fields.split(",").join(" ");
        }

        return this;
    }

    search() {
        if (this.queryString.q) {
            const searchTerm = this.queryString.q;

            const searchQuery = {
                $or: [
                    { name: { $regex: searchTerm, $options: "i" } },
                    { description: { $regex: searchTerm, $options: "i" } },
                ],
            };

            this._conditions = { ...this._conditions, ...searchQuery };
        }

        return this;
    }

    populate() {
        if (this.queryString.populate) {
            const fields = this.queryString.populate.split(",");
            this.options.populate = fields;
        }

        return this;
    }

    async execute() {
        try {
            const result = await this.model.paginate(this._conditions, this.options);

            return {
                results: result.docs.length,
                total: result.totalDocs,
                totalPages: result.totalPages,
                page: result.page,
                limit: result.limit,
                data: result.docs,
            };
        } catch (error) {
            throw error;
        }
    }
}
