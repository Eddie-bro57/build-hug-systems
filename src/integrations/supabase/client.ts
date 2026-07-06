import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function createSupabaseClient() {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(', ')}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

// ==========================================
// 🎭 PRESENTATION MODE DEMO MOCK auth & db
// ==========================================

const MOCK_USER = {
  id: "demo-user-id-00000",
  email: "demo@doguide.com",
  user_metadata: { display_name: "Demo Presenter" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  role: "authenticated",
  app_metadata: {},
};

const MOCK_SESSION = {
  access_token: "mock-session-jwt",
  token_type: "bearer",
  expires_in: 3600,
  refresh_token: "mock-session-refresh",
  user: MOCK_USER,
};

const _demoListeners = new Set<{ callback: any }>();

class MockQueryBuilder {
  table: string;
  private _filters: Array<{ col: string; val: any }> = [];

  constructor(table: string) {
    this.table = table;
  }
  
  static getList(table: string) {
    if (typeof window === 'undefined') return [];
    const key = `mock_db_${table}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
    
    // Default initial mock database records
    if (table === 'profiles') {
      return [{
        id: "demo-user-id-00000",
        display_name: "Demo Presenter",
        handle: "demo_presenter",
        bio: "Learning something new every day!",
        xp: 120,
        level: 2,
        streak_days: 3,
        reputation: 15
      }];
    }
    if (table === 'skill_levels') {
      return [
        { user_id: "demo-user-id-00000", category: "cooking", xp: 50, level: 1 },
        { user_id: "demo-user-id-00000", category: "technology", xp: 70, level: 2 }
      ];
    }
    if (table === 'achievements') {
      return [
        { id: "ach-1", code: "first_step", title: "First Step", description: "Complete your first guide step.", icon: "footprints", xp_reward: 10 },
        { id: "ach-2", code: "first_guide", title: "Done & Dusted", description: "Finish your first guide.", icon: "check-circle", xp_reward: 25 },
        { id: "ach-3", code: "streak_3", title: "On a Roll", description: "Maintain a 3-day learning streak.", icon: "flame", xp_reward: 30 }
      ];
    }
    if (table === 'user_achievements') {
      return [
        { user_id: "demo-user-id-00000", achievement_id: "ach-1", unlocked_at: new Date().toISOString(), achievement: { code: "first_step", title: "First Step", description: "Complete your first guide step." } }
      ];
    }
    if (table === 'notifications') {
      const welcomeNotifications = [
        {
          id: "notif-welcome",
          user_id: "demo-user-id-00000",
          title: "Welcome to DoGuide! 👋",
          body: "We are thrilled to have you join our learning community. Complete steps to earn XP, maintain your daily streak, and master new practical skills!",
          read: false,
          link: "/paths",
          created_at: new Date(Date.now() - 60000).toISOString()
        },
        {
          id: "notif-xp",
          user_id: "demo-user-id-00000",
          title: "First XP Earned! ⚡",
          body: "Great job! You earned 120 XP and reached Level 2. Check out your streak on your profile page.",
          read: true,
          link: "/profile",
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ];
      localStorage.setItem(key, JSON.stringify(welcomeNotifications));
      return welcomeNotifications;
    }
    return [];
  }
  
  static setList(table: string, list: any[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`mock_db_${table}`, JSON.stringify(list));
  }
  
  select(columns?: string) { return this; }
  order(column: string, options?: any) { return this; }
  limit(count: number) { return this; }
  
  eq(column: string, value: any) {
    this._filters.push({ col: column, val: value });
    return this;
  }

  private _getFilteredList() {
    let list = MockQueryBuilder.getList(this.table);
    for (const filter of this._filters) {
      list = list.filter((item: any) => item[filter.col] === filter.val);
    }
    return list;
  }
  
  maybeSingle() {
    const list = this._getFilteredList();
    return Promise.resolve({ data: list[0] || null, error: null });
  }
  
  single() {
    const list = this._getFilteredList();
    return Promise.resolve({ data: list[0] || null, error: null });
  }
  
  then(onfulfilled?: (value: any) => any) {
    const list = this._getFilteredList();
    const res = { data: list, error: null, count: list.length };
    return Promise.resolve(res).then(onfulfilled);
  }
  
  insert(values: any) {
    const list = MockQueryBuilder.getList(this.table);
    const newItems = Array.isArray(values) ? values : [values];
    newItems.forEach(item => {
      list.push({ 
        ...item, 
        id: item.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString()), 
        created_at: new Date().toISOString() 
      });
    });
    MockQueryBuilder.setList(this.table, list);
    return Promise.resolve({ data: newItems[0], error: null });
  }
  
  upsert(values: any, options?: any) {
    const list = MockQueryBuilder.getList(this.table);
    const newItems = Array.isArray(values) ? values : [values];
    newItems.forEach(item => {
      const idx = list.findIndex((x: any) => x.user_id === item.user_id && x.guide_id === item.guide_id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...item };
      } else {
        list.push({ 
          ...item, 
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString() 
        });
      }
    });
    MockQueryBuilder.setList(this.table, list);
    return Promise.resolve({ data: newItems[0], error: null });
  }
  
  update(values: any) {
    const list = MockQueryBuilder.getList(this.table);
    let updatedItem = null;
    const nextList = list.map((item: any) => {
      const matches = this._filters.every(f => item[f.col] === f.val);
      if (matches) {
        updatedItem = { ...item, ...values };
        return updatedItem;
      }
      return item;
    });
    MockQueryBuilder.setList(this.table, nextList);
    return Promise.resolve({ data: updatedItem || list[0] || null, error: null });
  }
  
  delete() {
    const list = MockQueryBuilder.getList(this.table);
    const nextList = list.filter((item: any) => {
      const matches = this._filters.every(f => item[f.col] === f.val);
      return !matches;
    });
    MockQueryBuilder.setList(this.table, nextList);
    return Promise.resolve({ error: null });
  }
}

const mockAuth = {
  async getSession() {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_active') === 'true';
    return { data: { session: isDemo ? MOCK_SESSION : null }, error: null };
  },
  async getUser() {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_active') === 'true';
    return { data: { user: isDemo ? MOCK_USER : null }, error: null };
  },
  async signInWithPassword({ email, password }: any) {
    if (email === 'demo@doguide.com' && password === 'password123') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo_active', 'true');
      }
      _demoListeners.forEach(listener => {
        listener.callback("SIGNED_IN", MOCK_SESSION);
      });
      return { data: { session: MOCK_SESSION, user: MOCK_USER }, error: null };
    }
    if (!_supabase) _supabase = createSupabaseClient();
    return _supabase.auth.signInWithPassword({ email, password });
  },
  async signUp(args: any) {
    if (args.email === 'demo@doguide.com') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo_active', 'true');
      }
      _demoListeners.forEach(listener => {
        listener.callback("SIGNED_IN", MOCK_SESSION);
      });
      return { data: { session: MOCK_SESSION, user: MOCK_USER }, error: null };
    }
    if (!_supabase) _supabase = createSupabaseClient();
    return _supabase.auth.signUp(args);
  },
  async signOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_active');
    }
    _demoListeners.forEach(listener => {
      listener.callback("SIGNED_OUT", null);
    });
    if (!_supabase) _supabase = createSupabaseClient();
    return _supabase.auth.signOut();
  },
  onAuthStateChange(callback: any) {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_active') === 'true';
    setTimeout(() => {
      callback(isDemo ? "SIGNED_IN" : "SIGNED_OUT", isDemo ? MOCK_SESSION : null);
    }, 0);
    
    const listener = { callback };
    _demoListeners.add(listener);
    return {
      data: {
        subscription: {
          unsubscribe() {
            _demoListeners.delete(listener);
          }
        }
      }
    };
  }
};

const authProxy = new Proxy(mockAuth as any, {
  get(target, prop, receiver) {
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
    }
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase.auth, prop, receiver);
  }
});

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_active') === 'true';
    
    if (prop === 'auth') {
      return authProxy;
    }
    
    if (isDemo) {
      if (prop === 'from') {
        return (table: string) => new MockQueryBuilder(table);
      }
      if (prop === 'rpc') {
        return (fn: string, args: any) => {
          if (fn === 'award_xp') {
            const profiles = MockQueryBuilder.getList('profiles');
            if (profiles.length > 0) {
              const p = profiles[0];
              const amount = args._amount || 0;
              p.xp += amount;
              const newLevel = Math.floor(Math.sqrt(p.xp / 50)) + 1;
              const leveledUp = newLevel > p.level;
              p.level = newLevel;
              MockQueryBuilder.setList('profiles', profiles);
              return Promise.resolve({
                data: [{ new_xp: p.xp, new_level: p.level, leveled_up: leveledUp }],
                error: null
              });
            }
          }
          return Promise.resolve({ data: null, error: null });
        };
      }
    }
    
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
