import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Wishlist from '../models/Wishlist.js';

const images = {
  beach: [
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85'
  ],
  mountain: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85'
  ],
  city: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85'
  ],
  desert: [
    'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85'
  ]
};

const landmarkPhotos = {
  Goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85',
  Mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85',
  Jaipur: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/East_facade_of_the_Hawa_Mahal%2C_Jaipur.jpg/1280px-East_facade_of_the_Hawa_Mahal%2C_Jaipur.jpg',
  Manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=85',
  Bengaluru: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Bangalore_Palace_-_Jayamahal.jpg/1280px-Bangalore_Palace_-_Jayamahal.jpg',
  Delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85',
  Bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
  Dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
  Paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85',
  London: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85'
};

const jaipurStayCovers = {
  hawa: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
  amber: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  jal: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
  cityPalace: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85'
};

const jaipurStayLandmarks = {
  hawa: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Hawa_Mahal_2011.jpg/1280px-Hawa_Mahal_2011.jpg',
  amber: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Jaipur_03-2016_02_Amber_Fort.jpg/1280px-Jaipur_03-2016_02_Amber_Fort.jpg',
  jal: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/20191218_Jal_Mahal_Palace_in_Jaipur_1429_9234.jpg/1280px-20191218_Jal_Mahal_Palace_in_Jaipur_1429_9234.jpg',
  cityPalace: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Jaipur_03-2016_20_City_Palace_complex.jpg/1280px-Jaipur_03-2016_20_City_Palace_complex.jpg'
};

const jaipurStayGalleryHomes = {
  hawa: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
  amber: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85',
  jal: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
  cityPalace: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'
};

const cityStayCovers = {
  'gurugram-1': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'gurugram-2': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
  'gurugram-3': 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85',
  'gurugram-4': 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85',
  'gurugram-5': 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=85',
  'gurugram-6': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
  'gurugram-7': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85',
  'gurugram-8': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
  'dehradun-1': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
  'dehradun-2': 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85',
  'dehradun-3': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
  'dehradun-4': 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1200&q=85',
  'dehradun-5': 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1200&q=85',
  'dehradun-6': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
  'dehradun-7': 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=85',
  'dehradun-8': 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=85'
};

const destinationStayPhotos = {
  'goa-basilica': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Basilica_of_Bom_Jesus_and_vehicles_parked_infront.jpg/1280px-Basilica_of_Bom_Jesus_and_vehicles_parked_infront.jpg',
  'goa-aguada': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Aguada_Fort_Top_View%2C_North_Goa.jpg/1280px-Aguada_Fort_Top_View%2C_North_Goa.jpg',
  'goa-dudhsagar': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Dudhsagar_Falls%2C_Goa_%2851821730751%29.jpg/1280px-Dudhsagar_Falls%2C_Goa_%2851821730751%29.jpg',
  'mumbai-marine-drive': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Marine_Drive_Mumbai.jpg/1280px-Marine_Drive_Mumbai.jpg',
  'mumbai-cst': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Chhatrapati_Shivaji_Terminus_%28Victoria_Terminus%29.jpg/1280px-Chhatrapati_Shivaji_Terminus_%28Victoria_Terminus%29.jpg',
  'mumbai-elephanta': 'https://upload.wikimedia.org/wikipedia/commons/3/3f/A_pillar_in_Cave_1%2C_Elephanta_Great_Cave_Mumbai.jpg',
  'manali-hidimba': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Hidimba_Devi_Temple%2C_Dhungri_Manali.jpg/1280px-Hidimba_Devi_Temple%2C_Dhungri_Manali.jpg',
  'manali-solang': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/A_view_of_solang_valley_on_the_way_to_rohtang_pass.jpg/1280px-A_view_of_solang_valley_on_the_way_to_rohtang_pass.jpg',
  'manali-rohtang': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Manali_to_Rohtang_Pass_01.jpg/1280px-Manali_to_Rohtang_Pass_01.jpg',
  'bengaluru-lalbagh': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Lalbagh_%28Lal_Baugh%29_Botanical_Garden_in_Bangalore_%28now_Bengaluru%29_1.jpg/1280px-Lalbagh_%28Lal_Baugh%29_Botanical_Garden_in_Bangalore_%28now_Bengaluru%29_1.jpg',
  'bengaluru-vidhana': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Gate_3_%28East%29%2C_Vidhana_Soudha_%2801%29.jpg/1280px-Gate_3_%28East%29%2C_Vidhana_Soudha_%2801%29.jpg',
  'bengaluru-cubbon': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Band-Stand-Cubbon-Park-Bengaluru-karnataka-India.jpg/1280px-Band-Stand-Cubbon-Park-Bengaluru-karnataka-India.jpg',
  'delhi-red-fort': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/20191203_Moti_Masjid%2C_Red_Fort%2C_Delhi_0502_6354_DxO.jpg/1280px-20191203_Moti_Masjid%2C_Red_Fort%2C_Delhi_0502_6354_DxO.jpg',
  'delhi-qutub': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Qutb_Minar_2011.jpg/1280px-Qutb_Minar_2011.jpg',
  'delhi-humayun': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/A_unique_frame_of_Humayun_Tomb%2C_Delhi.jpg/1280px-A_unique_frame_of_Humayun_Tomb%2C_Delhi.jpg',
  'bali-uluwatu': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Kuta_Bali_Indonesia_Pura-Luhur-Uluwatu-03.jpg/1280px-Kuta_Bali_Indonesia_Pura-Luhur-Uluwatu-03.jpg',
  'bali-tanah-lot': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Pura_Tanah_Lot%2C_Bali%2C_Indonesia%2C_20220827_1007_1147.jpg/1280px-Pura_Tanah_Lot%2C_Bali%2C_Indonesia%2C_20220827_1007_1147.jpg',
  'bali-tegallalang': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Rice_terraces%2C_Bali.jpg/1280px-Rice_terraces%2C_Bali.jpg',
  'dubai-palm': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Artificial_Archipelagos%2C_Dubai%2C_United_Arab_Emirates_ISS022-E-024940_lrg.jpg/1280px-Artificial_Archipelagos%2C_Dubai%2C_United_Arab_Emirates_ISS022-E-024940_lrg.jpg',
  'dubai-museum': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Museum_of_the_Future_Audi_Etron-Dubai_UAE-Andres_Larin.jpg/1280px-Museum_of_the_Future_Audi_Etron-Dubai_UAE-Andres_Larin.jpg',
  'dubai-marina': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Dubai_Marina_04.jpg/1280px-Dubai_Marina_04.jpg',
  'paris-louvre': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Cour_Napol%C3%A9on_%28Flickr%2C_Stavros_A%29.jpg/1280px-Cour_Napol%C3%A9on_%28Flickr%2C_Stavros_A%29.jpg',
  'paris-notre-dame': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Cath%C3%A9drale_Notre_Dame%2C_Paris_30_September_2015.jpg/1280px-Cath%C3%A9drale_Notre_Dame%2C_Paris_30_September_2015.jpg',
  'paris-arc': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Arc_Triomphe.jpg/1280px-Arc_Triomphe.jpg',
  'paris-sacre-coeur': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Basilique_du_Sacr%C3%A9-C%C5%93ur_de_Montmartre_-_Paris_-_GT-01_-_2024.jpg/1280px-Basilique_du_Sacr%C3%A9-C%C5%93ur_de_Montmartre_-_Paris_-_GT-01_-_2024.jpg',
  'london-big-ben': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Big_Ben_Elizabeth_Tower_London_2023_01.jpg/1280px-Big_Ben_Elizabeth_Tower_London_2023_01.jpg',
  'london-buckingham': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Buckingham_Palace%2C_London_-_April_2009.jpg/1280px-Buckingham_Palace%2C_London_-_April_2009.jpg',
  'london-eye': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/London_Eye_Twilight_April_2006.jpg/1280px-London_Eye_Twilight_April_2006.jpg',
  'london-st-pauls': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Cath%C3%A9drale_St-Paul_-_coupole.jpg/1280px-Cath%C3%A9drale_St-Paul_-_coupole.jpg',
  'jaipur-jantar': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/20191218_Jantar_Mantar%2C_Jaipur_0906_8983_DxO.jpg/1280px-20191218_Jantar_Mantar%2C_Jaipur_0906_8983_DxO.jpg',
  'delhi-lotus': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Lotus_Temple_in_New_Delhi_03-2016.jpg/1280px-Lotus_Temple_in_New_Delhi_03-2016.jpg',
  'jaipur-nahargarh': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/20191218_Fort_Nahargarh%2C_Jaipur_1514_9294.jpg/1280px-20191218_Fort_Nahargarh%2C_Jaipur_1514_9294.jpg',
  'goa-chapora': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Fort_Chapora_26012016.jpg/1280px-Fort_Chapora_26012016.jpg',
  'mumbai-gateway': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Panoramic_view_of_Taj_Palace_Hotel_and_Taj_Tower_with_the_iconic_Gateway_of_India_in_the_background.jpg/1280px-Panoramic_view_of_Taj_Palace_Hotel_and_Taj_Tower_with_the_iconic_Gateway_of_India_in_the_background.jpg',
  'manali-beas': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Beas_River_at_Nehru_Kund%2C_Manali_%282%29.jpg/1280px-Beas_River_at_Nehru_Kund%2C_Manali_%282%29.jpg',
  'bengaluru-nandi': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Nandi_Hills%2C_Bengaluru.jpg/1280px-Nandi_Hills%2C_Bengaluru.jpg',
  'bali-ulun-danu': 'https://upload.wikimedia.org/wikipedia/commons/d/db/Pura_Ulun_Danu_Beratan_in_bali.jpg',
  'dubai-burj': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Burj_dubai_3.11.08.jpg',
  'london-tower-bridge': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Tower_Bridge_London_Dusk_Feb_2006.jpg/1280px-Tower_Bridge_London_Dusk_Feb_2006.jpg',
  'paris-eiffel': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/1280px-Tour_Eiffel_Wikimedia_Commons.jpg'
};

const coordinatesByCity = {
  Goa: { lat: 15.2993, lng: 73.8243 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Manali: { lat: 32.2396, lng: 77.1887 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Bali: { lat: -8.4095, lng: 115.1889 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  London: { lat: 51.5072, lng: -0.1276 },
  Gurugram: { lat: 28.4595, lng: 77.0266 },
  Dehradun: { lat: 30.3165, lng: 78.0322 }
};

const listingTemplates = [
  ['Oceanfront villa in Goa', 'Goa', 'India', 'Villa', 'beach', 18000],
  ['Sea-view apartment in Mumbai', 'Mumbai', 'India', 'Apartment', 'beach', 9200],
  ['Heritage haveli in Jaipur', 'Jaipur', 'India', 'House', 'desert', 7600, 'hawa'],
  ['Glass cabin in Manali', 'Manali', 'India', 'Cabin', 'mountain', 6800],
  ['Modern loft in Bengaluru', 'Bengaluru', 'India', 'Apartment', 'city', 6100],
  ['Design home in Delhi', 'Delhi', 'India', 'House', 'city', 8200],
  ['Palm resort in Bali', 'Bali', 'Indonesia', 'Resort', 'beach', 14000],
  ['Luxury apartment in Dubai', 'Dubai', 'UAE', 'Apartment', 'city', 22000],
  ['Parisian studio near the Seine', 'Paris', 'France', 'Apartment', 'city', 16500],
  ['Townhouse in London', 'London', 'United Kingdom', 'House', 'city', 19500],
  ['Forest cottage near Goa', 'Goa', 'India', 'Cottage', 'mountain', 5400],
  ['Mountain chalet in Manali', 'Manali', 'India', 'Cabin', 'mountain', 9800],
  ['Beach bungalow in Bali', 'Bali', 'Indonesia', 'Cottage', 'beach', 8500],
  ['Penthouse in Mumbai', 'Mumbai', 'India', 'Apartment', 'city', 28000],
  ['Courtyard villa in Jaipur', 'Jaipur', 'India', 'Villa', 'desert', 12000, 'amber'],
  ['Boutique room in Delhi', 'Delhi', 'India', 'Room', 'city', 4200],
  ['Lagoon villa in Dubai', 'Dubai', 'UAE', 'Villa', 'desert', 32000],
  ['Garden retreat in Bengaluru', 'Bengaluru', 'India', 'House', 'mountain', 7200],
  ['Jal Mahal lakeside retreat', 'Jaipur', 'India', 'House', 'desert', 8900, 'jal'],
  ['City Palace rooftop haveli', 'Jaipur', 'India', 'Apartment', 'desert', 10400, 'cityPalace'],
  ['Garden apartment in Gurugram', 'Gurugram', 'India', 'Apartment', 'city', 7800, 'gurugram-1'],
  ['Farm stay near Gurugram', 'Gurugram', 'India', 'House', 'city', 12500, 'gurugram-2'],
  ['Modern home in Gurugram', 'Gurugram', 'India', 'House', 'city', 9600, 'gurugram-3'],
  ['Bright flat near Cyber City', 'Gurugram', 'India', 'Apartment', 'city', 6800, 'gurugram-4'],
  ['Private villa in Gurugram', 'Gurugram', 'India', 'Villa', 'city', 16200, 'gurugram-5'],
  ['Poolside retreat in Gurugram', 'Gurugram', 'India', 'Villa', 'city', 14800, 'gurugram-6'],
  ['Guest suite near Cyber Hub', 'Gurugram', 'India', 'Apartment', 'city', 8800, 'gurugram-7'],
  ['Rooftop home in Gurugram', 'Gurugram', 'India', 'Apartment', 'city', 10500, 'gurugram-8'],
  ['Mountain-view stay in Dehradun', 'Dehradun', 'India', 'Cottage', 'mountain', 7200, 'dehradun-1'],
  ['Hillside cottage in Dehradun', 'Dehradun', 'India', 'Cottage', 'mountain', 8400, 'dehradun-2'],
  ['Garden bungalow in Dehradun', 'Dehradun', 'India', 'House', 'mountain', 6900, 'dehradun-3'],
  ['Forest-edge cabin in Dehradun', 'Dehradun', 'India', 'Cabin', 'mountain', 7600, 'dehradun-4'],
  ['Riverside home in Dehradun', 'Dehradun', 'India', 'House', 'mountain', 9100, 'dehradun-5'],
  ['Quiet villa near Mussoorie Road', 'Dehradun', 'India', 'Villa', 'mountain', 11600, 'dehradun-6'],
  ['Cedar cottage in Dehradun', 'Dehradun', 'India', 'Cottage', 'mountain', 7800, 'dehradun-7'],
  ['Panoramic villa in Dehradun', 'Dehradun', 'India', 'Villa', 'mountain', 13400, 'dehradun-8'],
  ['Old Goa stay near Basilica of Bom Jesus', 'Goa', 'India', 'Apartment', 'city', 9700, 'goa-basilica'],
  ['Beach home near Fort Aguada', 'Goa', 'India', 'Villa', 'beach', 12200, 'goa-aguada'],
  ['Nature retreat near Dudhsagar Falls', 'Goa', 'India', 'Cottage', 'mountain', 7600, 'goa-dudhsagar'],
  ['Sea-view flat near Marine Drive', 'Mumbai', 'India', 'Apartment', 'city', 14500, 'mumbai-marine-drive'],
  ['Heritage stay near Chhatrapati Shivaji Terminus', 'Mumbai', 'India', 'Apartment', 'city', 11200, 'mumbai-cst'],
  ['Home near Elephanta Caves', 'Mumbai', 'India', 'House', 'beach', 8800, 'mumbai-elephanta'],
  ['Woodland stay near Hidimba Devi Temple', 'Manali', 'India', 'Cottage', 'mountain', 7600, 'manali-hidimba'],
  ['Mountain retreat near Solang Valley', 'Manali', 'India', 'Cabin', 'mountain', 8600, 'manali-solang'],
  ['Alpine home near Rohtang Pass', 'Manali', 'India', 'Cabin', 'mountain', 9900, 'manali-rohtang'],
  ['Garden home near Lalbagh Botanical Garden', 'Bengaluru', 'India', 'House', 'city', 7200, 'bengaluru-lalbagh'],
  ['City flat near Vidhana Soudha', 'Bengaluru', 'India', 'Apartment', 'city', 8400, 'bengaluru-vidhana'],
  ['Parkside stay near Cubbon Park', 'Bengaluru', 'India', 'Cottage', 'city', 7800, 'bengaluru-cubbon'],
  ['Heritage stay near Red Fort', 'Delhi', 'India', 'Apartment', 'city', 9300, 'delhi-red-fort'],
  ['Apartment near Qutub Minar', 'Delhi', 'India', 'Apartment', 'city', 8700, 'delhi-qutub'],
  ["Courtyard home near Humayun's Tomb", 'Delhi', 'India', 'House', 'city', 10200, 'delhi-humayun'],
  ['Ocean villa near Uluwatu Temple', 'Bali', 'Indonesia', 'Villa', 'beach', 16000, 'bali-uluwatu'],
  ['Island home near Tanah Lot', 'Bali', 'Indonesia', 'House', 'beach', 12800, 'bali-tanah-lot'],
  ['Rice terrace retreat near Tegallalang', 'Bali', 'Indonesia', 'Resort', 'mountain', 15200, 'bali-tegallalang'],
  ['Skyline apartment near Palm Jumeirah', 'Dubai', 'UAE', 'Apartment', 'city', 18500, 'dubai-palm'],
  ['Modern suite near Museum of the Future', 'Dubai', 'UAE', 'Apartment', 'city', 21000, 'dubai-museum'],
  ['Marina-view home near Dubai Marina', 'Dubai', 'UAE', 'House', 'city', 17000, 'dubai-marina'],
  ['Paris home near the Louvre Museum', 'Paris', 'France', 'Apartment', 'city', 18000, 'paris-louvre'],
  ['Quiet apartment near Notre-Dame Cathedral', 'Paris', 'France', 'Apartment', 'city', 16500, 'paris-notre-dame'],
  ['Suite near the Arc de Triomphe', 'Paris', 'France', 'Apartment', 'city', 19500, 'paris-arc'],
  ['Studio near Sacré-Cœur', 'Paris', 'France', 'Apartment', 'city', 14500, 'paris-sacre-coeur'],
  ['City flat near Big Ben', 'London', 'United Kingdom', 'Apartment', 'city', 19800, 'london-big-ben'],
  ['Townhouse near Buckingham Palace', 'London', 'United Kingdom', 'House', 'city', 22500, 'london-buckingham'],
  ['River-view stay near the London Eye', 'London', 'United Kingdom', 'Apartment', 'city', 20500, 'london-eye'],
  ["Heritage home near St Paul's Cathedral", 'London', 'United Kingdom', 'House', 'city', 21400, 'london-st-pauls'],
  ['Rooftop stay near Jantar Mantar', 'Jaipur', 'India', 'Apartment', 'desert', 9800, 'jaipur-jantar']
];

const additionalDestinationTemplates = [
  ['Sunny loft near Lotus Temple', 'Delhi', 'India', 'Apartment', 'city', 8800, 'delhi-lotus'],
  ['Hilltop haveli near Nahargarh Fort', 'Jaipur', 'India', 'House', 'desert', 11400, 'jaipur-nahargarh'],
  ['Clifftop home near Chapora Fort', 'Goa', 'India', 'Villa', 'beach', 13500, 'goa-chapora'],
  ['Harbor apartment near Gateway of India', 'Mumbai', 'India', 'Apartment', 'city', 16400, 'mumbai-gateway'],
  ['Riverside cottage near Beas River', 'Manali', 'India', 'Cottage', 'mountain', 7200, 'manali-beas'],
  ['Hill-view stay near Nandi Hills', 'Bengaluru', 'India', 'Cabin', 'mountain', 8900, 'bengaluru-nandi'],
  ['Lakeside retreat near Ulun Danu Temple', 'Bali', 'Indonesia', 'Resort', 'beach', 17400, 'bali-ulun-danu'],
  ['Downtown suite near Burj Khalifa', 'Dubai', 'UAE', 'Apartment', 'city', 24000, 'dubai-burj'],
  ['River-view flat near Tower Bridge', 'London', 'United Kingdom', 'Apartment', 'city', 23000, 'london-tower-bridge'],
  ['Parisian apartment near the Eiffel Tower', 'Paris', 'France', 'Apartment', 'city', 21000, 'paris-eiffel']
];

function createListingDocument(template, index, hostIds) {
  const [title, city, country, propertyType, imageKind, price, coverPhotoKey] = template;
  const nearbyLandmark = title.match(/\b(?:near|by)\s+(.+)$/i)?.[1];
  return {
    title,
    description: `A thoughtfully designed ${propertyType.toLowerCase()} with warm interiors and modern comforts${nearbyLandmark ? ` near ${nearbyLandmark}, a favorite place to explore in ${city}` : ` for an effortless stay in ${city}`}.`,
    location: nearbyLandmark ? `near ${nearbyLandmark}` : `${city} city area`,
    city,
    country,
    coordinates: coordinatesByCity[city],
    pricePerNight: price,
    images: [
      jaipurStayCovers[coverPhotoKey] || cityStayCovers[coverPhotoKey] || destinationStayPhotos[coverPhotoKey] || images[imageKind][0],
      jaipurStayLandmarks[coverPhotoKey] || (destinationStayPhotos[coverPhotoKey] ? images[imageKind][0] : landmarkPhotos[city] || images[imageKind][0]),
      jaipurStayGalleryHomes[coverPhotoKey] || images[imageKind][1]
    ],
    propertyType,
    bedrooms: 1 + (index % 4),
    beds: 1 + (index % 5),
    bathrooms: 1 + (index % 3),
    amenities: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'Workspace', 'Pool'].slice(0, 3 + (index % 3)),
    maxGuests: 2 + (index % 5),
    host: hostIds[index % hostIds.length],
    rating: index >= 20 ? 4.8 + (index % 3) / 10 : index === 0 ? 4.7 : 4.2 + (index % 8) / 10,
    reviewCount: index === 0 ? 3 : 8 + (index % 40),
    cleaningFee: 600 + (index % 4) * 150,
    instantBooking: index % 3 !== 0
  };
}

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany(), Listing.deleteMany(), Booking.deleteMany(), Review.deleteMany(), Wishlist.deleteMany()]);

  const users = await User.create([
    { name: 'Andrew Wilson', email: 'demo@staynest.com', password: 'Demo123!', role: 'USER', avatar: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Aarav Mehta', email: 'aarav@staynest.com', password: 'Demo123!', role: 'USER', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Ravi Sharma', email: 'ravi@staynest.com', password: 'Demo123!', role: 'USER', avatar: 'https://i.pravatar.cc/150?img=15' },
    { name: 'Saniya Khan', email: 'saniya@staynest.com', password: 'Demo123!', role: 'USER', avatar: 'https://i.pravatar.cc/150?img=44' },
    { name: 'Demo Host', email: 'host@staynest.com', password: 'Host123!', role: 'HOST', avatar: 'https://i.pravatar.cc/150?img=47' },
    { name: 'Maya Kapoor', email: 'maya@staynest.com', password: 'Demo123!', role: 'HOST', avatar: 'https://i.pravatar.cc/150?img=32' },
    { name: 'Airbnb Clone Admin', email: 'admin@staynest.com', password: 'Admin123!', role: 'ADMIN', avatar: 'https://i.pravatar.cc/150?img=5' }
  ]);

  const hostIds = [users[4]._id, users[5]._id];
  const allListingTemplates = [...listingTemplates, ...additionalDestinationTemplates];
  const listings = await Listing.insertMany(allListingTemplates.map((template, index) => createListingDocument(template, index, hostIds)));

  const now = new Date();
  const pastCheckIn = new Date(now);
  pastCheckIn.setDate(now.getDate() - 10);
  const pastCheckOut = new Date(now);
  pastCheckOut.setDate(now.getDate() - 7);
  const raviCheckIn = new Date(now);
  raviCheckIn.setDate(now.getDate() - 35);
  const raviCheckOut = new Date(now);
  raviCheckOut.setDate(now.getDate() - 32);
  const saniyaCheckIn = new Date(now);
  saniyaCheckIn.setDate(now.getDate() - 21);
  const saniyaCheckOut = new Date(now);
  saniyaCheckOut.setDate(now.getDate() - 18);

  const bookings = await Booking.insertMany([
    {
      user: users[0]._id, listing: listings[0]._id, checkIn: pastCheckIn, checkOut: pastCheckOut,
      guests: 2, nights: 3, pricePerNight: listings[0].pricePerNight,
      cleaningFee: listings[0].cleaningFee, serviceFee: 5400, totalPrice: 64500, status: 'completed'
    },
    {
      user: users[1]._id, listing: listings[1]._id, checkIn: new Date(now.getTime() + 86400000 * 12),
      checkOut: new Date(now.getTime() + 86400000 * 15), guests: 2, nights: 3,
      pricePerNight: listings[1].pricePerNight, cleaningFee: listings[1].cleaningFee,
      serviceFee: 2760, totalPrice: 30460, status: 'confirmed'
    },
    {
      user: users[2]._id, listing: listings[0]._id, checkIn: raviCheckIn, checkOut: raviCheckOut,
      guests: 3, nights: 3, pricePerNight: listings[0].pricePerNight,
      cleaningFee: listings[0].cleaningFee, serviceFee: 5400, totalPrice: 64500, status: 'completed'
    },
    {
      user: users[3]._id, listing: listings[0]._id, checkIn: saniyaCheckIn, checkOut: saniyaCheckOut,
      guests: 2, nights: 3, pricePerNight: listings[0].pricePerNight,
      cleaningFee: listings[0].cleaningFee, serviceFee: 5400, totalPrice: 64500, status: 'completed'
    }
  ]);

  await Review.insertMany([
    { user: users[0]._id, listing: listings[0]._id, booking: bookings[0]._id, rating: 5, comment: 'The villa was spotless, the pool area was beautiful, and we woke up to a calm ocean view every morning. The host was quick to help throughout our stay.' },
    { user: users[2]._id, listing: listings[0]._id, booking: bookings[2]._id, rating: 5, comment: 'One of the best family stays we have had in Goa. The rooms were spacious, breakfast was excellent, and the beach was only a short walk away.' },
    { user: users[3]._id, listing: listings[0]._id, booking: bookings[3]._id, rating: 4, comment: 'A peaceful and well-designed villa with beautiful interiors. Check-in was smooth, and we loved relaxing by the pool after exploring Goa.' },
    { user: users[1]._id, listing: listings[1]._id, booking: bookings[1]._id, rating: 4, comment: 'Great location and a comfortable apartment. The neighborhood has plenty of cafes and the sea view was lovely.' }
  ]);
  await Wishlist.insertMany([
    { user: users[0]._id, listing: listings[2]._id },
    { user: users[0]._id, listing: listings[6]._id }
  ]);

  console.log(`Seed complete: ${users.length} users, ${listings.length} listings, ${bookings.length} bookings`);
  await mongoose.disconnect();
}

async function addDestinationStays() {
  await connectDB();
  const hostEmails = ['host@staynest.com', 'maya@staynest.com'];
  const hosts = await User.find({ email: { $in: hostEmails } });
  const hostIds = hostEmails.map((email) => hosts.find((host) => host.email === email)?._id);
  if (hostIds.some((id) => !id)) throw new Error('Demo hosts are missing; seed the demo users before adding destination stays.');

  const titles = additionalDestinationTemplates.map(([title]) => title);
  const existingTitles = new Set(await Listing.distinct('title', { title: { $in: titles } }));
  const missingTemplates = additionalDestinationTemplates
    .map((template, index) => ({ template, index: listingTemplates.length + index }))
    .filter(({ template }) => !existingTitles.has(template[0]));

  if (missingTemplates.length) {
    await Listing.insertMany(missingTemplates.map(({ template, index }) => createListingDocument(template, index, hostIds)));
  }
  console.log(`Added ${missingTemplates.length} destination stays.`);
  await mongoose.disconnect();
}

const operation = process.argv.includes('--add-destination-stays') ? addDestinationStays : seed;

operation().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
