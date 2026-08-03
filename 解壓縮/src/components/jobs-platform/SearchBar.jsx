import React, { useState, useEffect } from 'react';

const cityDistricts = {
  '新北市': ['板橋區','三重區','中和區','永和區','新莊區','新店區','土城區','蘆洲區','汐止區','樹林區','鶯歌區','三峽區','淡水區','瑞芳區','五股區','泰山區','林口區','深坑區','石碇區','坪林區','三芝區','石門區','八里區','平溪區','雙溪區','貢寮區','金山區','萬里區','烏來區'],
  '台北市': ['中正區','大同區','中山區','松山區','大安區','萬華區','信義區','士林區','北投區','內湖區','南港區','文山區'],
  '桃園市': ['桃園區','中壢區','平鎮區','八德區','楊梅區','蘆竹區','大溪區','龜山區','大園區','觀音區','新屋區','龍潭區','復興區'],
};

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState([]); // confirmed selections
  const [tempSelected, setTempSelected] = useState([]); // selections inside modal
  const [activeCity, setActiveCity] = useState(null);
  const maxSelection = 10;

  // ----- Summary for region button -----
  const regionSummary = () => {
    if (selectedRegions.length === 0) return '全部地區';
    const cities = selectedRegions.filter(r => Object.keys(cityDistricts).includes(r));
    const districts = selectedRegions.filter(r => !Object.keys(cityDistricts).includes(r));
    const parts = [];
    if (cities.length) parts.push(cities.join('、'));
    if (districts.length) {
      const shown = districts.slice(0, 2).join('、');
      const more = districts.length - 2;
      parts.push(more > 0 ? `${shown} +${more}` : shown);
    }
    return parts.join('、');
  };

  // ----- Modal helpers -----
  const openModal = () => {
    setTempSelected(selectedRegions);
    setRegionModalOpen(true);
    setActiveCity(null);
  };

  const toggleCity = (city) => {
    const isSelected = tempSelected.includes(city);
    if (isSelected) {
      // Unselect whole city and any of its districts
      setTempSelected(prev => prev.filter(r => r !== city && !cityDistricts[city].includes(r)));
    } else {
      if (tempSelected.length >= maxSelection) return;
      setTempSelected(prev => [...prev, city]);
    }
  };

  const toggleDistrict = (city, district) => {
    const isSelected = tempSelected.includes(district);
    if (isSelected) {
      setTempSelected(prev => prev.filter(r => r !== district));
    } else {
      // If whole city is selected, remove it first then add district
      setTempSelected(prev => {
        const withoutCity = prev.filter(r => r !== city);
        if (withoutCity.length >= maxSelection) return prev;
        return [...withoutCity, district];
      });
    }
  };

  const clearTemp = () => {
    setTempSelected([]);
    setActiveCity(null);
  };

  const applySelection = () => {
    setSelectedRegions(tempSelected);
    // Trigger search with new locations
    onSearch({ keyword, locations: tempSelected, type });
    setRegionModalOpen(false);
    setActiveCity(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ keyword, locations: selectedRegions, type });
  };

  // close modal on ESC without applying changes
  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === 'Escape') setRegionModalOpen(false);
    };
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
      <input
        type="text"
        placeholder="關鍵字"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        className="p-2 border rounded"
      />
      {/* Region selector button */}
      <button type="button" onClick={openModal} className="p-2 border rounded text-left">
        {regionSummary()}
      </button>
      <select value={type} onChange={e => setType(e.target.value)} className="p-2 border rounded">
        <option value="">全部類型</option>
        <option value="fulltime">正職</option>
        <option value="dispatch">派遣</option>
        <option value="temp">臨時班</option>
        <option value="task">任務</option>
      </select>
      <button type="button" onClick={handleSubmit} className="bg-orange-600 text-white font-bold py-2 rounded hover:bg-orange-700">
        搜尋工作
      </button>

      {/* ---------- Region Modal ---------- */}
      {regionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={() => setRegionModalOpen(false)}>
          <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:max-w-2xl p-4 relative z-[10000]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">地區類別選單</h2>
              <button type="button" onClick={() => setRegionModalOpen(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="text-sm mb-2">已選擇：{tempSelected.length}/{maxSelection}</div>
            <div className="flex flex-col md:flex-row">
              {/* 左側城市列表 */}
              <div className="md:w-1/3 border-r pr-2">
                {Object.keys(cityDistricts).map(city => (
                  <div key={city} className={`flex items-center justify-between py-1 ${activeCity===city ? 'bg-orange-100' : ''}`}>
                    {/* Checkbox for selecting whole city */}
                    <input
                      type="checkbox"
                      checked={tempSelected.includes(city)}
                      onChange={() => toggleCity(city)}
                    />
                    {/* City name – click only toggles right panel */}
                    <span
                      className="cursor-pointer"
                      onClick={e => { e.stopPropagation(); setActiveCity(city); }}
                    >{city}</span>
                    {/* Arrow to expand/collapse */}
                    <span className="text-sm" onClick={e => { e.stopPropagation(); setActiveCity(city); }}>{activeCity===city ? '▾' : '▸'}</span>
                  </div>
                ))}
              </div>
              {/* 右側行政區或提示文字 */}
              <div className="md:w-2/3 pl-2 overflow-y-auto max-h-80">
                {activeCity ? (
                  <div>
                    <div className="font-medium mb-1">{activeCity}</div>
                    <div className="grid grid-cols-2 gap-1">
                      {cityDistricts[activeCity].map(district => (
                        <label key={district} className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={tempSelected.includes(district)}
                            onChange={() => toggleDistrict(activeCity, district)}
                          />
                          <span className="text-sm">{district}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">請先選擇城市</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <button type="button" onClick={clearTemp} className="text-gray-600 hover:underline">清除選擇</button>
              <button type="button" onClick={applySelection} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">確定</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
