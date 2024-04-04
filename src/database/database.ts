import { createClient } from '@supabase/supabase-js';
import { IDatabase, Tables } from './database.types';

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

  public async getAllSavedHotelsData(): Promise<ResponseHotel[]> {
    let { data: hotels, error } = await this.supabase.from('hotels').select('*');
    return hotels as ResponseHotel[];
  }

  public async setData(id: string, data: string) {
    const { error } = await this.supabase
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
