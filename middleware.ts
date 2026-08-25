import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Excluir rutas de API y archivos de PWA (manifest.json y sw.js) para que nunca sean bloqueados ni redirigidos
  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith('/api/') ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js'
  ) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Obtenemos la sesión del usuario
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginPage = pathname.startsWith('/login')
  const isAuthRoute = pathname.startsWith('/auth')

  // Definir páginas públicas que no requieren sesión (Términos, Privacidad y Registro)
  const isPublicPage = 
    pathname === '/terminos' || 
    pathname === '/privacidad' || 
    pathname.startsWith('/signup')

  // Si no hay usuario y NO está en una página permitida (login, auth o públicas), lo mandamos a /login
  if (!user && !isLoginPage && !isAuthRoute && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si YA está logueado e intenta ir a /login, lo mandamos al cotizador (raíz '/')
  if (user && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json & sw.js (PWA files)
     * - api (API routes like checkout and webhooks)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}