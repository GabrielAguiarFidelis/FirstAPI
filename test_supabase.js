import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config({ path: 'g:/FirstAPI/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function testInsert() {
  try {
    const password = 'testpassword123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ 
        nome: 'Test User', 
        email: 'test' + Date.now() + '@example.com', 
        password: hashedPassword, 
        plano: 'FREE' 
      }])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
    } else {
      console.log("Success:", data);
    }
  } catch (e) {
    console.error("Exception:", e);
  }
}

testInsert();
