import React from 'react';
import Slider from "react-slick";
import './AboutSlider.css';
import bottomFilmsSquare from '../images/bottomFilmsSquare.jpg'
import topFilmsSquare from '../images/topFilmsSquare.jpg'
import theMatrixSquare from '../images/theMatrixSquare.jpg'
import watchedCloserSquare from '../images/watchedCloserSquare.jpg'
import watchedSquare from '../images/watchedSquare.jpg'
import hollywoodReporter1 from '../images/hollywoodReporter1.jpg'


const AboutSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // adaptiveHeight: true,
    arrows: true,
  };

  return (
    <div className="about-slider">
      <Slider {...settings}>
        {/* Slide 1 - Motivation */}
        <div className="slide">
          <div className="slide-content">
            <img src={bottomFilmsSquare} alt="Motivation" className="slide-image" />
            <div className="slide-text">
              <h2>What's the Goal</h2>
              <div className="scrollable-text">
                <p>This system allows users to browse films based on how they have been reviewed in Top 100 lists, Best Of Lists e.g. Empire All time 100 and track which of these they've already watched.</p>
                <br/>

                <p>I found I was "running out" of great films to watch and although one can find meta scores on metacritic or rottentomatoes, I felt that there could/should be a way of finding films based on their "top 100 list value".</p>
                <br/>

                <p>Of course people who make lists maybe have biases from one year to another, from one publication to another, they're all different. So it would be best to average out these lists to give a score to assess how that film stands in a sort of "Meta-Top 100 list".</p>
                <br/>

                <p>It's to stand in addition to typical reviews, which might be reliable, might not. Marvel Comics movies get good reviews for some reason (e.g. money), but traditionally something like "Dog Day Afternoon" is gonna be on a lot of review lists, or "Apocalypse Now Redux", as they have endearing, timeless value. </p>
                <br/>

                <p>There are also films like "Network", that people just don't know about. I wanted to find more films like that.</p>
                <br/>
              </div>
            </div>
          </div>
        </div>
        {/* Slide 2 - Features */}
        <div className="slide">
          <div className="slide-content">
            <img src={watchedCloserSquare} alt="Features" className="slide-image" />
            <div className="slide-text">
              <h2>Features</h2>
              <div className="scrollable-text">
                <p>Additional functionality includes a "Watched list". Films that have already been seen, can be "checked off" aka marked as watched. This removes them from "film circulation" so the user can concentrate on the films they haven't seen.</p>
                <br/>
                <p>There's also a film details page that provides additional details about each film. Many other film features could be added in time.</p>
                <br/>
              </div>
            </div>
          </div>
        </div>
        {/* Slide 3 - Technical Details */}
        <div className="slide">
          <div className="slide-content">
            <img src={hollywoodReporter1} alt="Technical Details" className="slide-image" />
            <div className="slide-text">
              <h2>Technical Details</h2>
              <div className="scrollable-text">
                <p>This system connects to several data endpointss. The more data this system has, the more accurate it can be. Currently it has:</p>
                <ul>
                  <li>* Empire's Top 100</li>
                  <li>* Hollywood Report Top 100</li>
                  <li>* American Film Institute</li>
                  <li>* IMDB Top 250</li>
                </ul>
                <br/>

                <p>For movie data, I had to choose between IMDB and TMDB, as it's best to have one source of data (a central book of reference). IMDB is more well known but I don't its API is as well developed.</p>
                <br/>
                <p>Conversely, TMDB has the IMDB ID, I like their documentation, seems fast, seems an open aPI. IMDB, more closed.
                https://www.themoviedb.org/</p>
                <br/>

                <p>They both have their OWN ratings per film (IMDB rating and TMDB rating), but that's not quite what this system is about (currently).</p>
                <br/>

              </div>
            </div>
          </div>
        </div>
      </Slider>
    </div>
    // <div className="about-slider">
    //   <Slider {...settings}>
    //     {/* Slide 1 - Motivation */}
    //     <div className="slide">
    //     </div>
    //     {/* Slide 2 - Features */}
    //     <div className="slide">
    //     </div>
    //     {/* Slide 3 - Technical Details */}
    //     <div className="slide">
    //     </div>
    //   </Slider>
    // </div>

  );
};

export default AboutSlider;
