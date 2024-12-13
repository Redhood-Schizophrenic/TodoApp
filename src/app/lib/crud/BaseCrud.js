export class BaseCrud {
  constructor(model) {
    this.model = model;
  }

  // Create a new document
  async create(data) {
    try {
      const doc = new this.model(data);
      await doc.save();
      console.log(doc)
      return {
        returncode: 200,
        message: "Data Created Successfully",
        output: doc
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  // Read all documents with optional filters
  async readMany(filters = {}, options = {}) {
    try {
      const {
        sort = {},
        populate = [],
        select = '',
        skip = 0,
        limit = 0,
        lean = false
      } = options;

      let query = this.model.find(filters);

      // Apply population
      if (populate.length > 0) {
        query = query.populate(populate);
      }

      // Apply sorting
      if (Object.keys(sort).length > 0) {
        query = query.sort(sort);
      }

      // Apply selection
      if (select) {
        query = query.select(select);
      }

      // Apply pagination
      if (skip > 0) {
        query = query.skip(skip);
      }
      if (limit > 0) {
        query = query.limit(limit);
      }

      // Execute query
      const docs = lean ? await query.lean() : await query.exec();

      return {
        returncode: 200,
        message: "Data Fetched Successfully",
        output: docs
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  // Read a single document
  async readOne(filters = {}, options = {}) {
    try {
      const { populate = [], select = '', lean = false } = options;

      let query = this.model.findOne(filters);

      // Apply population
      if (populate.length > 0) {
        query = query.populate(populate);
      }

      // Apply selection
      if (select) {
        query = query.select(select);
      }

      // Execute query
      const doc = lean ? await query.lean() : await query.exec();

      if (!doc) {
        return {
          returncode: 404,
          message: "Document Not Found",
          output: []
        };
      }

      return {
        returncode: 200,
        message: "Data Fetched Successfully",
        output: doc
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  // Update a document
  async update(filters = {}, data = {}, options = { new: true }) {
    try {
      const doc = await this.model.findOneAndUpdate(filters, data, options);

      if (!doc) {
        return {
          returncode: 404,
          message: "Document Not Found",
          output: []
        };
      }

      return {
        returncode: 200,
        message: "Data Updated Successfully",
        output: doc
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  // Delete a document
  async delete(filters = {}) {
    try {
      console.log('BaseCrud.delete called with:', {
        model: this.model.modelName,
        filters
      });

      const doc = await this.model.deleteMany(filters);
      console.log('BaseCrud.delete result:', doc);

      if (!doc || doc.deletedCount === 0) {
        console.log('BaseCrud.delete - No documents found');
        return {
          returncode: 404,
          message: "Document Not Found",
          output: []
        };
      }

      return {
        returncode: 200,
        message: "Data Deleted Successfully",
        output: doc
      };
    } catch (error) {
      console.error('Error in BaseCrud.delete:', error);
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  // Check if document exists
  async exists(filters = {}) {
    try {
      const exists = await this.model.exists(filters);
      return {
        returncode: 200,
        message: exists ? "Document Exists" : "Document Not Found",
        output: !!exists
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: false
      };
    }
  }

  // Count documents
  async count(filters = {}) {
    try {
      const count = await this.model.countDocuments(filters);
      return {
        returncode: 200,
        message: "Count Retrieved Successfully",
        output: count
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: 0
      };
    }
  }
}
