export class Network {
  private countryId: number = 0; // id страны отдыха;
  private cityId: number = 345; // id города вылета

  private priceMin = 0; //минимальная стоимость отдыха;
  private priceMax = 999999; //max стоимость отдыха;

  private before = ''; //верхняя планка диапазона даты заезда; 31.05.2010
  private after = ''; //нижняя планка диапазона даты заезда; 21.05.2010

  private currencyId = 5561; // id валюты, в которой указана цена;

  public nightsMin: null | number = null; //минимальное количество ночей, проведенных в отеле;
  public nightsMax: null | number = null; // максимальное количество ночей, проведенных в отеле;

  hotelClassId = 2569; // id уровня отеля(звездность);
  accommodationId = 2; //– id размещения;
  rAndBId = 2424; // id пансиона;

  public setCountryId(value: number): void {
    this.countryId = value;
  }

  public setCityId(value: number): void {
    this.cityId = value;
  }

  public setCurrencyId(value: number): void {
    this.currencyId = value;
  }

  public setMaxPrice(value: number): void {
    this.priceMax = value;
  }

  public setDate(before: string, after: string): void {
    this.before = before;
    this.after = after;
  }

  public setMinNights(value: number): void {
    this.nightsMin = value;
  }

  public setMaxNights(value: number): void {
    this.nightsMax = value;
  }

  public clear(): void {
    this.nightsMin = null;
    this.nightsMax = null;
  }
}
