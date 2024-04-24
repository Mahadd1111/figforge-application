import Nav from '@/components/nav'

export default function NonAuthLayout({ children }) {
  return (
        <div className='h-screen flex flex-col '>
          <Nav />
          {
            children
          }
        </div>
  )
}
