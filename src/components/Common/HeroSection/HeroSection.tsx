import hero from "../../../assets/images/stake/hero_Background.png";
import { Container } from "react-bootstrap";
import "./HeroSectionStyle.scss";

const HeroSection = () =>{
    return(
        <>
            <div className="hero_section" >
                <div className="hero_section_img" >
                    <img src={hero} alt="hero_image" />
                </div>
                <Container>
                    <div className="hero_section_info" >
                        <h5>LOSTBOY STUDIO<sup>TM</sup></h5>
                    </div>
                </Container>
            </div>
        </>
    );
}

export default HeroSection;