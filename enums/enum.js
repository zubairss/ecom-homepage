const rolesArr = ["admin", "user"];
const bannerTypesArr = ["mainPage", "header", "productPage"];
const productCategoriesArr = ['Mens Wear', "Womens Wear", "Electronics", 'Toys', "Sports and Outdoor", 'Home and Kitchen', "Tools and Improvement"];
const userType = ["local", "social"]
const genders = ['male', 'female']

const authRoles = new Map();
authRoles.set("user", ["getSelf", "deleteSelf", "updateSelf"]);
authRoles.set("admin", ["manageUsers", "manageBanners", "manageProducts"]);


module.exports = { rolesArr, bannerTypesArr, productCategoriesArr, userType, authRoles, genders };