import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import Registration from './components/Registration/Registration';
import Authorization from './components/Authorization/Authorization';
import BeautyBooth from './components/BeautyBooth/BeautyBooth';
import MakeupArtists from './components/MakeupArtists/MakeupArtists';
import FreshTrends from './components/FreshTrends/FreshTrends';
import ArtistRatings from './components/ArtistRatings/ArtistRatings';
import Reviews from './components/Reviews/Reviews';
import History from './components/History/History';
import Profile from './components/Profile/Profile';
import Portfolio from './components/Portfolio/Portfolio';
import ReviewArt from './components/ReviewArt/ReviewArt';
import SignUp from './components/SignUp/SignUp';
import Favorites from './components/Favorites/Favorites';
import Services from './components/Services/Services';
import Reservations from './components/Reservations/Reservations';
import Setting from './components/Setting/Setting';
import ArtistAuth from './components/ArtistAuth/ArtistAuth';
import ProfileArtist from './components/ProfileArtist/ProfileArtist';
import MyCalendar from './components/MyCalendar/MyCalendar';
import MyPortfolio from './components/MyPortfolio/MyPortfolio';
import MyApplication from './components/MyApplication/MyApplication';
import MyService from './components/MyService/MyService';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/Authorization" element={<Authorization />} />
            <Route path="/beauty-booth" element={<BeautyBooth />} />
            <Route path="/makeup-artists" element={<MakeupArtists />} />
            <Route path="/fresh-trends" element={<FreshTrends />} />
            <Route path="/artist-ratings" element={<ArtistRatings />} />
            <Route path="/portfolio/:artistId" element={<Portfolio />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sign-up/:artistId/:serviceId" element={<SignUp />} />
            <Route path="/review-art/:artistId" element={<ReviewArt />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/services/:artistId" element={<Services />} />
            <Route path="/reservations" element={<Reservations />} /> 
            <Route path="/setting" element={<Setting />} />
            <Route path="/artist-auth" element={<ArtistAuth />} />
            <Route path="/profile-artist" element={<ProfileArtist />} />
            <Route path="/my-calendar" element={<MyCalendar />} />
            <Route path="/my-portfolio" element={<MyPortfolio />} />
            <Route path="/my-application" element={<MyApplication />} />
            <Route path="/my-service" element={<MyService />} />



        </Routes>
    );
}

export default App;