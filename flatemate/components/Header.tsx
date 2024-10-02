import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

const Header=()=>{
    const session=useSession();

    return(
        <header className="bg-primary text-primary-foreground py-6 px-4 md:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold" prefetch={false}>
            FlatMate
          </Link>
          <div className="flex items-center gap-4">
            {
              session.data?.user ? <Link
              href="#"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
              onClick={()=>{signOut()}}
            >
              Signout
            </Link>:<Link
              href="#"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
              onClick={()=>{signIn()}}
            >
              SignIn
              
            </Link>
            }
            
          </div>
        </div>
      </header>
    )
}
export default Header;