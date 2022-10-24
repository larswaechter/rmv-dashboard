export interface IProduct {
  name: string;
  internalName: string;
  displayNumber: string;
  catOut: string;
  catCode: string;
}

export class Product {
  name: string;
  internalName: string;
  displayNumber: string;
  catOut: string;
  catCode: string;

  static ofResponse(res: IProduct): Product {
    const product = new Product();

    product.name = res.name;
    product.internalName = res.internalName;
    product.displayNumber = res.displayNumber;
    product.catOut = res.catOut;
    product.catCode = res.catCode;

    return product;
  }
}
