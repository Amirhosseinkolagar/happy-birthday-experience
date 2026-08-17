"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  motion,
} from "motion/react";


type ExperienceCreditsProps = {
  onHome: () => void;
};


type Credit =
  | {
      type: "brand";
      title: string;
      subtitle?: string;
    }
  | {
      type: "section";
      title: string;
      subtitle: string;
    }
  | {
      type: "role";
      title: string;
      subtitle: string;
    }
  | {
      type: "message";
      title: string;
      subtitle: string;
    }
  | {
      type: "thanks";
      title: string;
      subtitle: string;
    }
  | {
      type: "final";
      title: string;
      subtitle: string;
    };


export default function ExperienceCredits({
  onHome,
}: ExperienceCreditsProps) {


  const audioRef =
    useRef<HTMLAudioElement | null>(null);


  const [creditsFinished, setCreditsFinished] =
    useState(false);



  /*
  ======================================================
  ENDING MUSIC SYSTEM
  ======================================================
  */


  useEffect(() => {


    const audio =
      new Audio(
        "/audio/pixora-ending.mp3"
      );


    audio.volume = 0;


    audio.loop = false;


    audioRef.current = audio;



    audio
      .play()
      .catch(() => {});



    let volume = 0;



    const fadeIn =
      window.setInterval(() => {


        if(volume < 0.65){

          volume += 0.02;

          audio.volume =
            Math.min(
              volume,
              0.65
            );

        } else {

          clearInterval(fadeIn);

        }


      },80);



    return () => {


      clearInterval(fadeIn);


      let fadeOutVolume =
        audio.volume;



      const fadeOut =
        window.setInterval(() => {


          fadeOutVolume -= 0.03;


          if(
            fadeOutVolume <=0
          ){

            audio.pause();

            audio.currentTime = 0;

            clearInterval(fadeOut);


          } else {


            audio.volume =
              fadeOutVolume;


          }


        },80);



    };


  },[]);





  /*
  ======================================================
  CREDIT CONTENT
  ======================================================
  */


  const credits =
    useMemo<Credit[]>(

      () => [

        {
          type:"brand",
          title:"PIXORA",
          subtitle:
            "AN INTERACTIVE DIGITAL EXPERIENCE",
        },


        {
          type:"section",
          title:
            "یک تجربه فقط ساخته نمی‌شود.",
          subtitle:
            "با احساس، انتخاب، طراحی و تکنولوژی شکل می‌گیرد.",
        },


        {
          type:"role",
          title:
            "Creative Direction",
          subtitle:
            "Alex Morgan • Sofia Bennett",
        },


        {
          type:"role",
          title:
            "Product Experience Design",
          subtitle:
            "Daniel Carter • Emma Wilson",
        },


        {
          type:"role",
          title:
            "UX / UI Design",
          subtitle:
            "Olivia Parker • Noah Anderson",
        },


        {
          type:"role",
          title:
            "Frontend Engineering",
          subtitle:
            "James Miller • Mia Roberts",
        },


        {
          type:"role",
          title:
            "Creative Technology",
          subtitle:
            "Lucas Evans • Amelia Scott",
        },


        {
          type:"role",
          title:
            "Motion & Interaction Design",
          subtitle:
            "Henry Walker • Chloe Adams",
        },


        {
          type:"role",
          title:
            "Artificial Intelligence Experience",
          subtitle:
            "William Turner • Ava Mitchell",
        },


        {
          type:"role",
          title:
            "Visual Identity",
          subtitle:
            "Benjamin Hall • Lily Cooper",
        },


        {
          type:"role",
          title:
            "Sound Atmosphere",
          subtitle:
            "Michael Reed • Grace Lewis",
        },


        {
          type:"message",
          title:
            "هر جزئیات یک دلیل داشت.",
          subtitle:
            "از نور و رنگ تا حرکت و صدا؛ همه چیز برای ساختن یک لحظه خاص طراحی شد.",
        },


        {
          type:"message",
          title:
            "این فقط یک رابط نبود.",
          subtitle:
            "یک فضای تعاملی بود که برای ایجاد احساس ساخته شد.",
        },


        {
          type:"thanks",
          title:
            "ممنون که همراه PIXORA بودی.",
          subtitle:
            "امیدواریم این تجربه، یک خاطره کوچک اما ماندگار ساخته باشد.",
        },


        {
          type:"final",
          title:
            "بعضی تجربه‌ها تمام نمی‌شوند.",
          subtitle:
            "فقط تبدیل به یک خاطره می‌شوند.",
        },


        {
          type:"brand",
          title:
            "PIXORA",
          subtitle:
            "CREATE • FEEL • REMEMBER",
        },


      ],

      []

    );





  /*
  ======================================================
  CREDIT TIMER
  ======================================================
  */


  useEffect(()=>{


    const timer =
      window.setTimeout(()=>{


        setCreditsFinished(true);



      },46000);



    return()=>{


      window.clearTimeout(timer);


    };


  },[]);

  /*
  ======================================================
  CREDIT SCROLL RENDER
  ======================================================
  */


  if (creditsFinished) {
  return (
    <main
      dir="rtl"
      className="credits-final-screen"
    >


      <div
        className="credits-background"
      />


      <div
        className="credits-noise"
      />


      <div
        className="credits-vignette"
      />



      <div
        className="credits-glow credits-glow-one"
      />

      <div
        className="credits-glow credits-glow-two"
      />



      <motion.div

        className="
        credits-final-content
        "

        initial={{
          opacity:0,
          y:30,
          scale:0.96,
        }}

        animate={{
          opacity:1,
          y:0,
          scale:1,
        }}

        transition={{
          duration:1.8,
          ease:[
            0.16,
            1,
            0.3,
            1,
          ],
        }}

      >



        <div
          className="
          credits-final-symbol
          "
        >
          ✦
        </div>




        <span
          className="
          credits-final-eyebrow
          "
        >
          PIXORA EXPERIENCE
        </span>





        <h1>

          یک تجربه تمام شد،

          <br />

          اما یک احساس باقی ماند.

        </h1>





        <div
          className="
          credits-final-line
          "
        />





        <p>

          ساخته شده با انتخاب،
          طراحی و تکنولوژی.

          <br />

          برای لحظه‌هایی که فراموش نمی‌شوند.

        </p>






        <button

          type="button"

          onClick={onHome}

          className="
          credits-home-button
          "

        >

          بازگشت به خانه


        </button>






        <span

          className="
          credits-final-note
          "

        >

          PIXORA

          <br />

          CREATE • FEEL • REMEMBER


        </span>





      </motion.div>



    </main>
  );
}

  return (

    <main
      dir="rtl"
      className="credits-screen"
    >


      <div className="credits-background" />


      <div className="credits-noise" />


      <div className="credits-vignette" />



      <div className="credits-scroll-wrapper">


        <motion.div

          className="credits-scroll"


          initial={{
            y:"110vh",
          }}


          animate={{

            y:"-125%",

          }}


          transition={{

            duration:46,

            ease:"linear",

          }}

        >



          {/* =====================================
              HEADER
          ===================================== */}


          <header
            className="credits-header"
          >


            <div
              className="credits-brand"
            >
              PIXORA
            </div>



            <div
              className="credits-brand-line"
            />



            <div
              className="credits-brand-subtitle"
            >
              AN INTERACTIVE DIGITAL EXPERIENCE
            </div>



          </header>





          {/* =====================================
              OPENING MESSAGE
          ===================================== */}



          <section
            className="credits-opening"
          >


            <p>

              یک تجربه دیجیتال
              <br />

              که با احساس، طراحی و تکنولوژی شکل گرفت.

            </p>



            <span>

              ساخته شده برای لحظه‌هایی
              که فقط دیده نمی‌شوند؛
              بلکه احساس می‌شوند.

            </span>



          </section>







          {/* =====================================
              CREDITS LIST
          ===================================== */}



          <section
            className="credits-list"
          >



            {
              credits.map(
                (
                  credit,
                  index
                )=>{


                  const key =
                    `${credit.type}-${index}`;




                  /*
                  BRAND BLOCK
                  */


                  if(
                    credit.type==="brand"
                  ){

                    return (

                      <div

                        key={key}

                        className="
                        credits-item
                        credits-brand-block
                        "

                      >


                        <h2>
                          {credit.title}
                        </h2>



                        {
                          credit.subtitle &&
                          (

                            <span>
                              {
                                credit.subtitle
                              }
                            </span>

                          )
                        }



                      </div>

                    );

                  }





                  /*
                  SECTION BLOCK
                  */


                  if(
                    credit.type==="section"
                  ){

                    return (

                      <div

                        key={key}

                        className="
                        credits-item
                        credits-intro-block
                        "

                      >


                        <h2>
                          {credit.title}
                        </h2>



                        <p>
                          {credit.subtitle}
                        </p>



                      </div>

                    );


                  }





                  /*
                  ROLE BLOCK
                  */


                  if(
                    credit.type==="role"
                  ){

                    return (

                      <div

                        key={key}

                        className="
                        credits-item
                        credits-role
                        "

                      >


                        <h3>
                          {credit.title}
                        </h3>



                        <p>
                          {credit.subtitle}
                        </p>



                      </div>

                    );


                  }





                  /*
                  MESSAGE BLOCK
                  */


                  if(
                    credit.type==="message"
                  ){

                    return (

                      <div

                        key={key}

                        className="
                        credits-item
                        credits-message
                        "

                      >


                        <h2>
                          {credit.title}
                        </h2>



                        <p>
                          {credit.subtitle}
                        </p>



                      </div>

                    );

                  }





                  /*
                  THANKS BLOCK
                  */


                  if(
                    credit.type==="thanks"
                  ){

                    return (

                      <div

                        key={key}

                        className="
                        credits-item
                        credits-thanks
                        "

                      >


                        <h2>
                          {credit.title}
                        </h2>



                        <p>
                          {credit.subtitle}
                        </p>



                      </div>

                    );

                  }





                  /*
                  FINAL MESSAGE
                  */


                  return (

                    <div

                      key={key}

                      className="
                      credits-item
                      credits-final-message
                      "

                    >


                      <h2>
                        {credit.title}
                      </h2>



                      <p>
                        {credit.subtitle}
                      </p>



                    </div>

                  );


                }

              )
            }



          </section>






          {/* =====================================
              FOOTER
          ===================================== */}



          <footer
            className="credits-footer"
          >



            <div
              className="credits-footer-line"
            />



            <div
              className="credits-footer-brand"
            >

              PIXORA

            </div>



            <div
              className="credits-footer-copy"
            >

              برای تجربه‌هایی که فقط دیده نمی‌شوند؛

              <br />

              بلکه احساس می‌شوند.

            </div>



            <div
              className="credits-footer-year"
            >

              © PIXORA EXPERIENCE

            </div>



          </footer>




        </motion.div>


      </div>





      {/* سینمایی Fade بالا */}


      <div
        className="credits-top-fade"
      />



      {/* سینمایی Fade پایین */}


      <div
        className="credits-bottom-fade"
      />



    </main>

  );

}

