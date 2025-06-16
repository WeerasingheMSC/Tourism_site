import Decore from '../../assets/decore.png'
import CustomPackageForm from './CustomPackageForm'

const hero1 = () => {
  return (
    <div className='pb-1'>
      <div className='relative bg-gray-200 lg:bg-white overflow-hidden box-border border-gray-300 rounded-lg shadow-lg lg:border-none lg:shadow-none'>
        {/* Desktop Images - Keep original positioning for lg and xl */}
        <img src={Decore} alt="" className='absolute bottom-100 right-0 hidden lg:flex'/>
        <h1 className="text-3xl font-bold text-center mb-0 text-black mt-25 p-4  drop-shadow">
        Customised your packages
      </h1>

        <CustomPackageForm />
      </div>
    </div>
  )
}
export default hero1