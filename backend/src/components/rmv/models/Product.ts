export interface IProduct {
  name: string;
  internalname: string;
  displaynumber: string;
  catOut: string;
  catCode: number;
}

export class Product {
  name: string;
  internalName: string;
  displayNumber: string;
  catOut: string;
  catCode: number;

  static ofResponse(res: IProduct): Product {
    const product = new Product();

    product.name = res.name;
    product.internalName = res.internalname;
    product.displayNumber = res.displaynumber;
    product.catOut = res.catOut;
    product.catCode = res.catCode;

    return product;
  }
}
