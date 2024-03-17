export class Network {
  private countryId: number = 0; // id страны отдыха;
  private cityId: number = 345; // id города вылета
  private priceMin = 0; //минимальная стоимость отдыха;
  private priceMax = 999999; //max стоимость отдыха;
  private before = 0; //верхняя планка диапазона даты заезда; 31.05.2010
  private after = 0; //нижняя планка диапазона даты заезда; 21.05.2010
  private currency = 5561; // id валюты, в которой указана цена;
  nightsMin = 7; //минимальное количество ночей, проведенных в отеле;
  nightsMax = 15; // максимальное количество ночей, проведенных в отеле;
  hotelClassId = 2569; // id уровня отеля(звездность);
  accommodationId = 2; //– id размещения;
  rAndBId = 2424; // id пансиона;

  public setCountryId(value: number): void {
    this.countryId = value;
  }
}
