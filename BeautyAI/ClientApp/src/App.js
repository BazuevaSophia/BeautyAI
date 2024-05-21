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
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/review-art" element={<ReviewArt />} />

        </Routes>
    );
}

export default App;