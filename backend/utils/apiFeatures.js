
class ApiFeatures {
    constructor(query, queryStr) {
        // query is the Product.find() query
        this.query = query;
 
        // queryStr is the req.query
        this.queryStr = queryStr;
    }
 
    // Search Function for Finding Products
    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                // search for anything that has the keyword in it
                $regex: this.queryStr.keyword,
 
                // case insensitive
                $options: 'i'
            }
        } : {}
 
        // find all products that match the keyword
        this.query = this.query.find({...keyword});
 
        return this;
    }
 
    // Filter Function
    filter(){
        // copy of req.query
        const queryCopy = {...this.queryStr};
 
        // Removing fields from the query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(key => delete queryCopy[key]);
 
        // filter for price and ratings
 
        // console.log(queryCopy);
       
        //price for change in String to Number
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
 
        //as an Object
        this.query = this.query.find(JSON.parse(queryStr));
 
        // console.log(queryStr);
        // this.query = this.query.find(queryCopy);
        return this;
    }
 
    // Pagination Function
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
 
        // skip the number of products per page
        const skip = resultPerPage * (currentPage - 1);
 
        // limit the number of products per page
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}
 
module.exports = ApiFeatures;