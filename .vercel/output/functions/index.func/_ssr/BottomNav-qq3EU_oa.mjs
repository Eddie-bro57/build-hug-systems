import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, d as useNavigate, L as Link, e as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { l as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { s as supabase } from "./client-Cb98OQ8D.mjs";
import { R as Root, P as Portal, C as Content, a as Close, T as Title, D as Description, O as Overlay } from "../_libs/radix-ui__react-dialog.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { R as Root2$1, L as List, T as Trigger$1, C as Content$1 } from "../_libs/radix-ui__react-tabs.mjs";
import { R as Root$1 } from "../_libs/radix-ui__react-label.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { u as useQuery, a as useMutation } from "../_libs/tanstack__react-query.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-1c1s4yWy.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, L as Label2, S as Separator2, I as Item2, a as SubTrigger2, b as SubContent2, c as CheckboxItem2, d as ItemIndicator2, e as RadioItem2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { p as Search, Z as Zap, q as LogOut, H as House, R as Route, U as User, X, r as MicOff, s as Mic, F as Flame, t as Mail, u as Lock, C as CircleCheck, L as LoaderCircle, v as TriangleAlert, w as ChevronRight, x as Check, l as Circle } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, a as arrayType, e as enumType } from "../_libs/zod.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
const logo = "/assets/logo-WoBtrJHm.png";
let _user = null;
let _session = null;
let _loading = true;
let _initialized = false;
const _listeners = /* @__PURE__ */ new Set();
function emit() {
  for (const l of _listeners) l({ user: _user, session: _session, loading: _loading });
}
function ensureInit() {
  if (_initialized || typeof window === "undefined") return;
  _initialized = true;
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
function useAuth() {
  const [state, setState] = reactExports.useState({ user: _user, session: _session, loading: _loading });
  reactExports.useEffect(() => {
    ensureInit();
    const listener = (s) => setState(s);
    _listeners.add(listener);
    setState({ user: _user, session: _session, loading: _loading });
    return () => {
      _listeners.delete(listener);
    };
  }, []);
  return {
    ...state,
    signOut: async () => {
      await supabase.auth.signOut();
    }
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Dialog = Root;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const Tabs = Root2$1;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger$1,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger$1.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content$1,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content$1.displayName;
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root$1, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root$1.displayName;
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const signUpSchema = objectType({
  displayName: stringType().trim().min(2, "Name must be at least 2 characters").max(60, "Name must be 60 characters or fewer"),
  email: stringType().trim().email("Enter a valid email").max(255),
  password: stringType().min(8, "Password must be at least 8 characters").max(72, "Password must be 72 characters or fewer")
});
const signInSchema = objectType({
  email: stringType().trim().email("Enter a valid email").max(255),
  password: stringType().min(1, "Enter your password").max(72)
});
function AuthModal({
  open,
  onOpenChange,
  defaultMode = "signup"
}) {
  const [mode, setMode] = reactExports.useState(defaultMode);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [displayName, setDisplayName] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [info, setInfo] = reactExports.useState(null);
  const reset = () => {
    setEmail("");
    setPassword("");
    setDisplayName("");
    setError(null);
    setInfo(null);
    setSubmitting(false);
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const parsed = signUpSchema.safeParse({ displayName, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your input");
      return;
    }
    setSubmitting(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: parsed.data.displayName }
      }
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      onOpenChange(false);
      reset();
    } else {
      setInfo("Check your email to confirm your account, then sign in.");
    }
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your input");
      return;
    }
    setSubmitting(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    onOpenChange(false);
    reset();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (o) => {
        onOpenChange(o);
        if (!o) reset();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Welcome to DoGuide" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Create an account to save guides, track recents, and pick up where you left off." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Tabs,
          {
            value: mode,
            onValueChange: (v) => {
              setMode(v);
              setError(null);
              setInfo(null);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signup", children: "Sign up" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signin", children: "Sign in" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signup", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignUp, className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "su-name", children: "Display name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "su-name",
                        value: displayName,
                        onChange: (e) => setDisplayName(e.target.value),
                        placeholder: "Your name",
                        autoComplete: "name",
                        maxLength: 60,
                        className: "pl-9",
                        required: true
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "su-email", children: "Email" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "su-email",
                        type: "email",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        placeholder: "you@example.com",
                        autoComplete: "email",
                        maxLength: 255,
                        className: "pl-9",
                        required: true
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "su-password", children: "Password" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "su-password",
                        type: "password",
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        placeholder: "At least 8 characters",
                        autoComplete: "new-password",
                        minLength: 8,
                        maxLength: 72,
                        className: "pl-9",
                        required: true
                      }
                    )
                  ] })
                ] }),
                error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", role: "alert", children: error }),
                info && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "inline-flex items-center gap-1.5 text-sm text-emerald-600", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
                  " ",
                  info
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submitting, className: "w-full", children: [
                  submitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                  "Create account"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "By signing up you agree to our terms and privacy policy." })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signin", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignIn, className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "si-email", children: "Email" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "si-email",
                        type: "email",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        placeholder: "you@example.com",
                        autoComplete: "email",
                        maxLength: 255,
                        className: "pl-9",
                        required: true
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "si-password", children: "Password" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "si-password",
                        type: "password",
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        placeholder: "Your password",
                        autoComplete: "current-password",
                        maxLength: 72,
                        className: "pl-9",
                        required: true
                      }
                    )
                  ] })
                ] }),
                error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", role: "alert", children: error }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submitting, className: "w-full", children: [
                  submitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                  "Sign in"
                ] })
              ] }) })
            ]
          }
        )
      ] })
    }
  );
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const quickFix = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  query: stringType().min(2).max(200)
})).handler(createSsrRpc("ddf3a97db7af5c8c9b645baecf6451a6f097d069fc5c7bf1dcfc444d6a95e5d8"));
const MessageSchema = objectType({
  role: enumType(["user", "assistant"]),
  content: stringType()
});
const troubleshoot = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  guideTitle: stringType(),
  stepTitle: stringType().optional(),
  problem: stringType().min(2).max(500),
  history: arrayType(MessageSchema).optional()
})).handler(createSsrRpc("be859a15c39ba904bdf48e4e41378ba31a56c0fd609ddc630201b3f1c6171a43"));
function QuickFixDialog({
  open,
  onOpenChange,
  trigger
}) {
  const [q, setQ] = reactExports.useState("");
  const call = useServerFn(quickFix);
  const mut = useMutation({
    mutationFn: (query) => call({ data: { query } })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    trigger,
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-amber-600" }),
          " QuickFix"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Get a 30-second practical answer. For full steps, use search instead." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            const v = q.trim();
            if (v) mut.mutate(v);
          },
          className: "flex gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                autoFocus: true,
                value: q,
                onChange: (e) => setQ(e.target.value),
                placeholder: "e.g. My WiFi keeps dropping…",
                className: "flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: mut.isPending || !q.trim(), children: mut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Ask" })
          ]
        }
      ),
      mut.isError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive", children: mut.error.message }),
      mut.data && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: mut.data.answer }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 text-sm", children: mut.data.steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-primary", children: [
            i + 1,
            "."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s })
        ] }, i)) }),
        mut.data.warning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: mut.data.warning })
        ] })
      ] })
    ] }) })
  ] });
}
function VoiceSearchButton({ onTranscript, className }) {
  const [supported, setSupported] = reactExports.useState(false);
  const [listening, setListening] = reactExports.useState(false);
  const recRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript ?? "";
      if (text) onTranscript(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {
      }
    };
  }, [onTranscript]);
  if (!supported) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => {
        if (!recRef.current) return;
        if (listening) {
          recRef.current.stop();
          setListening(false);
        } else {
          try {
            recRef.current.start();
            setListening(true);
          } catch {
            setListening(false);
          }
        }
      },
      className: className ?? `grid h-9 w-9 place-items-center rounded-full border border-border transition ${listening ? "bg-rose-500 text-white" : "bg-white text-muted-foreground hover:text-foreground"}`,
      "aria-label": listening ? "Stop voice search" : "Start voice search",
      title: "Voice search",
      children: listening ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-4 w-4" })
    }
  );
}
async function awardXp(amount, category) {
  if (amount <= 0) return null;
  const { data, error } = await supabase.rpc("award_xp", {
    _amount: amount,
    _category: category ?? void 0
  });
  if (error) {
    console.warn("award_xp failed", error);
    return null;
  }
  const row = data?.[0] ?? null;
  if (row?.leveled_up) {
    toast.success(`⭐ Level up! You're now level ${row.new_level}`, {
      description: `${row.new_xp} XP total`
    });
  } else if (row) {
    toast(`+${amount} XP`, { description: `${row.new_xp} XP total`, duration: 2e3 });
  }
  return row;
}
async function checkAchievements(userId) {
  const [profileRes, completedRes, anyStepRes, commentsRes, savesRes, pathsRes, votesRes, unlockedRes, catalogRes] = await Promise.all([
    supabase.from("profiles").select("level, streak_days").eq("id", userId).maybeSingle(),
    supabase.from("guide_progress").select("guide_id", { count: "exact", head: true }).eq("user_id", userId).eq("is_completed", true),
    supabase.from("guide_progress").select("completed_steps").eq("user_id", userId).limit(50),
    supabase.from("comments").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("saved_guides").select("guide_id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("learning_paths").select("id", { count: "exact", head: true }).eq("creator_id", userId).eq("is_published", true),
    supabase.from("guide_votes").select("guide_id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("user_achievements").select("achievement:achievements(code)").eq("user_id", userId),
    supabase.from("achievements").select("id, code, title, xp_reward")
  ]);
  const unlocked = new Set(
    (unlockedRes.data ?? []).map((r) => r.achievement?.code).filter(Boolean)
  );
  const catalog = catalogRes.data ?? [];
  const level = profileRes.data?.level ?? 1;
  const streak = profileRes.data?.streak_days ?? 0;
  const guidesDone = completedRes.count ?? 0;
  const anyStep = (anyStepRes.data ?? []).some(
    (r) => Array.isArray(r.completed_steps) && r.completed_steps.length > 0
  );
  const comments = commentsRes.count ?? 0;
  const saves = savesRes.count ?? 0;
  const paths = pathsRes.count ?? 0;
  const votes = votesRes.count ?? 0;
  const conditions = {
    first_step: anyStep || guidesDone >= 1,
    first_guide: guidesDone >= 1,
    five_guides: guidesDone >= 5,
    streak_3: streak >= 3,
    streak_7: streak >= 7,
    level_5: level >= 5,
    first_comment: comments >= 1,
    first_save: saves >= 1,
    first_path: paths >= 1,
    first_upvote: votes >= 1
  };
  for (const ach of catalog) {
    if (unlocked.has(ach.code)) continue;
    if (!conditions[ach.code]) continue;
    const { error: insErr } = await supabase.from("user_achievements").insert({ user_id: userId, achievement_id: ach.id });
    if (insErr) continue;
    toast.success(`🏆 ${ach.title}`, {
      description: ach.xp_reward > 0 ? `+${ach.xp_reward} XP` : "Achievement unlocked"
    });
    if (ach.xp_reward > 0) {
      await supabase.rpc("award_xp", { _amount: ach.xp_reward });
    }
  }
}
function xpToNextLevel(currentXp, currentLevel) {
  const nextAt = currentLevel * currentLevel * 50;
  return { needed: Math.max(0, nextAt - currentXp), nextAt };
}
function XpHud() {
  const { user } = useAuth();
  const q = useQuery({
    queryKey: ["xp-hud", user?.id ?? ""],
    enabled: !!user,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("xp, level, streak_days").eq("id", user.id).maybeSingle();
      return data ?? { xp: 0, level: 1, streak_days: 0 };
    }
  });
  if (!user || !q.data) return null;
  const level = q.data.level;
  const xp = q.data.xp;
  const { needed, nextAt } = xpToNextLevel(xp, level);
  const prevAt = (level - 1) * (level - 1) * 50;
  const span = Math.max(1, nextAt - prevAt);
  const currentProgress = Math.max(0, xp - prevAt);
  const pct = Math.min(100, Math.round(currentProgress / span * 100));
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - pct / 100 * circumference;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/profile",
      className: "hidden items-center gap-3 rounded-full border border-border bg-white/80 pl-2 pr-3.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md transition-all hover:bg-white hover:-translate-y-0.5 sm:inline-flex",
      title: `${needed} XP to level ${level + 1} (${xp} total XP)`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-6 w-6 items-center justify-center", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "absolute h-full w-full -rotate-90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "12",
                cy: "12",
                r: radius,
                className: "stroke-slate-100 fill-transparent",
                strokeWidth: "2"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "12",
                cy: "12",
                r: radius,
                className: "stroke-primary fill-transparent transition-all duration-500 ease-out",
                strokeWidth: "2",
                strokeDasharray: circumference,
                strokeDashoffset,
                strokeLinecap: "round"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-slate-700", children: level })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-300 font-normal", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-amber-600 hover:text-amber-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5 fill-amber-500/20 text-amber-500 animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            q.data.streak_days,
            "d"
          ] })
        ] })
      ]
    }
  );
}
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
function TopBar({ showSearch = true }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = reactExports.useState(false);
  const [authMode, setAuthMode] = reactExports.useState("signin");
  const [quickOpen, setQuickOpen] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    navigate({ to: "/search", search: { q: v } });
  };
  const displayName = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Account";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 px-4 pt-2 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 px-4 py-3 shadow-[0_8px_32px_rgba(31,38,135,0.07)] backdrop-blur-xl md:gap-6 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex shrink-0 items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: logo,
            alt: "DoGuide",
            className: "h-9 w-9 rounded-xl shadow-md",
            width: 36,
            height: 36
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden leading-tight sm:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold tracking-tight md:text-lg", children: "DoGuide" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Learn anything" })
        ] })
      ] }),
      showSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit, className: "flex flex-1 items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative flex w-full items-center rounded-2xl border-0 bg-white/50 ring-1 ring-slate-200 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "ml-3 h-4 w-4 shrink-0 text-muted-foreground group-focus-within:text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: q,
            onChange: (e) => setQ(e.target.value),
            placeholder: "Search any task…",
            className: "flex-1 bg-transparent py-2.5 pl-2 pr-2 text-sm outline-none placeholder:text-muted-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          VoiceSearchButton,
          {
            className: "mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground",
            onTranscript: (t) => {
              setQ(t);
              navigate({ to: "/search", search: { q: t } });
            }
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2 md:gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(XpHud, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setQuickOpen(true),
            className: "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-white px-2.5 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted",
            title: "QuickFix: 30-second answer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-amber-500" }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "QuickFix" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden h-6 w-px bg-border md:block" }),
        user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground",
              "aria-label": "Account menu",
              children: displayName.charAt(0).toUpperCase()
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "truncate", children: user.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", className: "cursor-pointer", children: "My profile" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => void signOut(), className: "cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
              " Sign out"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "hidden sm:inline-flex",
              onClick: () => {
                setAuthMode("signin");
                setAuthOpen(true);
              },
              children: "Sign in"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: () => {
                setAuthMode("signup");
                setAuthOpen(true);
              },
              children: "Sign up"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AuthModal, { open: authOpen, onOpenChange: setAuthOpen, defaultMode: authMode }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(QuickFixDialog, { open: quickOpen, onOpenChange: setQuickOpen })
  ] });
}
const tabs = [
  { to: "/", label: "Home", icon: House, match: (p) => p === "/" },
  { to: "/search", label: "Search", icon: Search, match: (p) => p.startsWith("/search") },
  { to: "/paths", label: "Paths", icon: Route, match: (p) => p.startsWith("/path") },
  { to: "/profile", label: "Profile", icon: User, match: (p) => p.startsWith("/profile") }
];
function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/90 backdrop-blur md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mx-auto flex max-w-6xl items-stretch justify-around", children: tabs.map((t) => {
    const Icon = t.icon;
    const active = t.match(pathname);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: t.to,
        className: `flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }),
          t.label
        ]
      }
    ) }, t.label);
  }) }) });
}
export {
  BottomNav as B,
  Dialog as D,
  TopBar as T,
  useAuth as a,
  awardXp as b,
  createSsrRpc as c,
  checkAchievements as d,
  DialogContent as e,
  DialogHeader as f,
  DialogTitle as g,
  DialogDescription as h,
  troubleshoot as t,
  useServerFn as u,
  xpToNextLevel as x
};
