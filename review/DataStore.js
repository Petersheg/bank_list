

export default class DataStore{
    AddCustomer(customer){
        if(localStorage.getItem(customer.bvn)){
            localStorage.removeItem(customer.bvn)
        }
        localStorage.setItem(customer.name, JSON.stringify(customer))
    }
    GetCustomerByBVN(bvn){
        var customerAsJSON = localStorage.getItem(bvn)
        return customerAsJSON ? JSON.parse(customerAsJSON) : null;
    }

}