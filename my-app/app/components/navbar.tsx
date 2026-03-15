import Image from "next/image";
import RegisterButton from "./registerButton";

export default function Navbar() {
    return (
        <div className="pb-4">
            <div className="flex justify-between">
                <div>
                    <Image
                        src="/IECSE.svg"
                        alt="IECSE logo"
                        width={150}
                        height={100}
                        priority
                    />
                </div>

                <div>
                    <div>
                        <RegisterButton />
                    </div>
                </div>
            
            </div>
        </div>
    );
}