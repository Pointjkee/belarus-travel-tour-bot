import { createClient, SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';
import { HotelType } from '../network/network';
import { IDatabase, Tables } from './database.types';

export class Database {
  public supabase: SupabaseClient<IDatabase>;

  constructor() {
    this.supabase = createClient<IDatabase>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  private connect() {

  }

  public async getAllSavedHotels(id: string): Promise<HotelType[] | null> {
    const response: PostgrestResponse<ResponseHotel> = await this.supabase
      .from('hotels')
      .select('*')
      .eq('id', id);


    if (response.error) {
      console.error('Ошибка при запросе данных:', response.error);
      return null;
    }

    const hotels = response.data?.map((item: ResponseHotel) => {
      return JSON.parse(item.data);
    });

    return !hotels?.length ? null : hotels;
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
