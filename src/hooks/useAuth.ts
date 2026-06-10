import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Listener = (state: { user: User | null; session: Session | null; loading: boolean }) => void;

let _user: User | null = null;
let _session: Session | null = null;
let _loading = true;
let _initialized = false;
const _listeners = new Set<Listener>();

function emit() {
  for (const l of _listeners) l({ user: _user, session: _session, loading: _loading });
}

function ensureInit() {
  if (_initialized || typeof window === "undefined") return;
  _initialized = true;

  // Register listener FIRST, then fetch session
  supabase.auth.onAuthStateChange((_event, session) => {
    _session = session;
    _user = session?.user ?? null;
    _loading = false;
    emit();
  });

  supabase.auth.getSession().then(({ data }) => {
    _session = data.session;
    _user = data.session?.user ?? null;
    _loading = false;
    emit();
  });
}

export function useAuth() {
  const [state, setState] = useState({ user: _user, session: _session, loading: _loading });

  useEffect(() => {
    ensureInit();
    const listener: Listener = (s) => setState(s);
    _listeners.add(listener);
    // Sync immediately
    setState({ user: _user, session: _session, loading: _loading });
    return () => {
      _listeners.delete(listener);
    };
  }, []);

  return {
    ...state,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };
}
