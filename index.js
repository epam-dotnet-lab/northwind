const axios = require('axios');

const output = {
    categories: [],
    products: [],
    customers: [],
    employees: [],
    orders: [],
    orderDetails: [],
    regions: [],
    shippers: [],
    suppliers: [],
    territories: [],
};

const serviceUrl = "https://services.odata.org/V3/Northwind/Northwind.svc/";

(async () => {
    try {
        const loadCategories = loadEntitiesFromOdataService(serviceUrl, "Categories");
        const loadProducts = loadEntitiesFromOdataService(serviceUrl, "Products");
        const loadCustomers = loadEntitiesFromOdataService(serviceUrl, "Customers");
        const loadEmployees = loadEntitiesFromOdataService(serviceUrl, "Employees");
        const loadOrders = loadEntitiesFromOdataService(serviceUrl, "Orders");
        const loadOrderDetails = loadEntitiesFromOdataService(serviceUrl, "Order_Details");
        const loadRegions = loadEntitiesFromOdataService(serviceUrl, "Regions");
        const loadShippers = loadEntitiesFromOdataService(serviceUrl, "Shippers");
        const loadSuppliers = loadEntitiesFromOdataService(serviceUrl, "Suppliers");
        const loadTerritories = loadEntitiesFromOdataService(serviceUrl, "Territories");

        axios.all([
            loadCategories,
            loadProducts,
            loadCustomers,
            loadEmployees,
            loadOrders,
            loadOrderDetails,
            loadRegions,
            loadShippers,
            loadSuppliers,
            loadTerritories,
        ]).then((r) => {
            const categoryEntities = r[0];
            const productEntities = r[1];
            const customerEntities = r[2];
            const employeeEntities = r[3];
            const orderEntities = r[4];
            const orderDetailEntities = r[5];
            const regionEntities = r[6];
            const shipperEntities = r[7];
            const supplierEntities = r[8];
            const territoryEntities = r[9];
            
            output.categories = categoryEntities.map(mapCategory);
            output.products = productEntities.map(mapProduct);
            output.customers = customerEntities.map(mapCustomer);
            output.employees = employeeEntities.map(mapEmployee);
            output.orders = orderEntities.map(mapOrder);
            output.orderDetails = orderDetailEntities.map(mapOrderDetail);
            output.regions = regionEntities.map(mapRegion);
            output.shippers = shipperEntities.map(mapShipper);
            output.suppliers = supplierEntities.map(mapSupplier);
            output.territories = territoryEntities.map(mapTerritory);

            console.log(JSON.stringify(output, null, 2));
        });
    }
    catch (error) {
        console.log(error);
    }
})();

async function loadEntitiesFromOdataService(serviceUrl, resource) {
    const config = {
        headers: {
            "Accept": "application/json",
        }
    };

    let running = true;
    const entities = [];

    while (running) {
        const response = await axios.get(`${serviceUrl}${resource}`, config);
        response.data.value.forEach((e) => {
            entities.push(e);
        });

        if (response.data['odata.nextLink'] !== undefined) {
            resource = response.data['odata.nextLink'];
        } else {
            running = false;
        }
    }

    return entities;
}

function mapCategory(c) {
    return {
        categoryId: c.CategoryID,
        categoryName: c.CategoryName,
        description: c.Description,
    }
}

function mapProduct(p) {
    return {
        productId: p.ProductID,
        productName: p.ProductName,
        supplierId: p.SupplierID,
        categoryId: p.CategoryID,
        quantityPerUnit: p.QuantityPerUnit,
        unitPrice: p.UnitPrice,
        unitsInStock: p.UnitsInStock,
        unitsOnOrder: p.UnitsOnOrder,
        reorderLevel: p.ReorderLevel,
        discontinued: p.Discontinued,
    };
}

function mapCustomer(c) {
    const entity = {
        customerId: c.CustomerID,
        companyName: c.CompanyName,
        contactName: c.ContactName,
        contactTitle: c.ContactTitle,
        address: c.Address,
        city: c.City,
        postalCode: c.PostalCode,
        country: c.Country,
        phone: c.Phone,
    };

    if (c.Region !== null) {
        entity.region = c.Region;
    }

    if (c.Fax !== null) {
        entity.fax = c.Fax;
    }

    return entity;
}

function mapEmployee(e) {
    const entity = {
        employeeId: e.EmployeeID,
        lastName: e.LastName,
        firstName: e.FirstName,
        title: e.Title,
        titleOfCourtesy: e.TitleOfCourtesy,
        birthDate: e.BirthDate,
        hireDate: e.HireDate,
        address: e.Address,
        city: e.City,
        postalCode: e.PostalCode,
        country: e.Country,
        homePhone: e.HomePhone,
        extension: e.Extension,
        notes: e.Notes,
        photoPath: e.PhotoPath,
    };

    if (e.ReportsTo !== null) {
        entity.reportsTo = e.ReportsTo;
    }

    if (e.Region !== null) {
        entity.region = e.Region;
    }

    return entity;
}

function mapOrder(o) {
    const entity = {
        orderId: o.OrderID,
        customerId: o.CustomerID,
        employeeId: o.EmployeeID,
        orderDate: o.OrderDate,
        requiredDate: o.RequiredDate,
        shippedDate: o.ShippedDate,
        shipVia: o.ShipVia,
        freight: o.Freight,
        shipName: o.ShipName,
        shipAddress: o.ShipAddress,
        shipCity: o.ShipCity,
        shipPostalCode: o.ShipPostalCode,
        shipCountry: o.ShipCountry,
    };

    if (o.ShipRegion !== null) {
        entity.shipRegion = o.ShipRegion;
    }

    return entity;
}

function mapOrderDetail(d) {
    const entity = {
        orderId: d.OrderID,
        productId: d.ProductID,
        unitPrice: d.UnitPrice,
        quantity: d.Quantity,
        discount: d.Discount,
    };

    return entity;
}

function mapRegion(r) {
    return {
        regionId: r.RegionID,
        regionDescription: r.RegionDescription,
    };
}

function mapShipper(s) {
    return {
        shipperId: s.ShipperID,
        companyName: s.CompanyName,
        phone: s.Phone,
    };
}

function mapSupplier(s) {
    var entity = {
        supplierId: s.SupplierID,
        companyName: s.CompanyName,
        contactName: s.ContactName,
        contactTitle: s.ContactTitle,
        address: s.Address,
        city: s.City,
        PostalCode: s.PostalCode,
        Country: s.Country,
        Phone: s.Phone,
    };

    if (s.Region !== null) {
        entity.region = s.Region;
    }

    if (s.Fax !== null) {
        entity.fax = s.Fax;
    }

    if (s.HomePage !== null) {
        entity.homePage = s.HomePage;
    }
    return entity;
}

function mapTerritory(t) {
    return {
        territoryId: t.TerritoryID,
        description: t.TerritoryDescription.trim(),
        regionId: t.RegionID,
    };
}