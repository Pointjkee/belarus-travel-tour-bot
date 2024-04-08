import { createClient } from '@supabase/supabase-js';
import { HotelType } from '../network/network';
import { IDatabase, Tables } from './database.types';

type HotelData = {
  id: string;
  data: string;
};

export class Database {
  public supabase: any;

  constructor() {
    this.connect();
  }

  private connect() {
    this.supabase = createClient<IDatabase>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  public async getAllSavedHotels(id: string): Promise<HotelType[] | null> {
    const { data: data }: { data: ResponseHotel[] } = await this.supabase
      .from('hotels')
      .select(`*`)
      .eq('id', id);
    const hotels = data?.map((item: HotelData) => {
      return JSON.parse(item.data);
    });

    return !hotels.length ? null : hotels;
  }

  public async saveHotel(id: string, data: string) {
    await this.supabase
      .from('hotels')
      .insert([
        {
          id,
          data,
        },
      ])
      .select();
  }
}

export type ResponseHotel = Tables<'hotels'>;
