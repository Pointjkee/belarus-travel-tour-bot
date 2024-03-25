import axios from 'axios';

export class Network {
  private url: string = 'http://search.tez-tour.com';
  private countryId: number = 0; // id страны отдыха;
  private cityId: number = 345; // id города вылета

  private priceMin = 0; //минимальная стоимость отдыха;
  private priceMax = 999999; //max стоимость отдыха;

  private before = ''; //верхняя планка диапазона даты заезда; 31.05.2010
  private after = ''; //нижняя планка диапазона даты заезда; 21.05.2010

  private currencyId = 5561; // id валюты, в которой указана цена;

  public nightsMin: null | number = null; //минимальное количество ночей, проведенных в отеле;
  public nightsMax: null | number = null; // максимальное количество ночей, проведенных в отеле;

  private hotelClassId = 2569; // id уровня отеля(звездность);
  private hotelClassBetter = true;
  private accommodationId = 2; //– id размещения;
  private rAndBId = 2424; // id пансиона;
  private rAndBBetter = true;

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

  public setDate(after: string, before: string): void {
    this.before = before;
    this.after = after;
  }

  public setMinNights(value: number): void {
    this.nightsMin = value;
  }

  public setMaxNights(value: number): void {
    this.nightsMax = value;
  }

  public setHotelClassId(value: number): void {
    this.hotelClassId = value;
  }

  public setRAndBId(value: number): void {
    this.rAndBId = value;
  }

  public async getHotelsListRequest(): Promise<void> {
    await axios({
      method: 'get',
      url: `${this.url}/tariffsearch/getResult?accommodationId=${this.accommodationId}&after=${this.after}&before=${this.before}&cityId=${this.cityId}&countryId=${this.countryId}&nightsMin=${this.nightsMin}&nightsMax=${this.nightsMax}&currency=${this.currencyId}&priceMin=${this.priceMin}&priceMax=${this.priceMax}&hotelClassId=${this.hotelClassId}&hotelClassBetter=${this.hotelClassBetter}&rAndBId=${this.rAndBId}&rAndBBetter=${this.rAndBBetter}`,
    })
      .then((response: IResponse) => {})
      .catch((error) => {});
  }

  public clear(): void {
    this.nightsMin = null;
    this.nightsMax = null;
  }
}

export interface IResponse {
  status: number;
  statusText: string;
  data: {
    success: boolean;
    message: string;
    serverName: string;
    departureCityId: number;
    arrivalCountryId: number;
    data: object[];
  };
}

//data[0] - отель
//data[0][0] - "13.06.2024"
//data[0][5][4] - "Анталия"
//data[0][6][0] - ссылка https://www.tez-tour.com/hotel.html?id=326222
//data[0][6][1] - название отеля "SELGE HOTEL 3 *"
//data[0][6][2] - фото  "https://s.tez-tour.com/hotel/50003736/DSC_1088_8707_small.JPG"
//data[0][7][1] - только завтраки
//data[0][10]["currency"] - валюта $
//data[0][10]["total"] - 450
