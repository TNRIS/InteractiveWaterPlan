using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InteractiveWaterPlan.Models
{

    public class PixelBufferTable
    {
        private IDictionary<int, PixelBufferPair> _bufferPairByZoomLevel;

        public PixelBufferTable()
        {
            _bufferPairByZoomLevel = new Dictionary<int, PixelBufferPair>();
        }

        public void AddPixelBufferPair(int zoomLevel, double groundRes, int multiplier)
        {
            this._bufferPairByZoomLevel.Add(zoomLevel, new PixelBufferPair(groundRes, multiplier));
        }

        public PixelBufferPair GetPixelBufferPair(int zoomLevel)
        {
            return _bufferPairByZoomLevel[zoomLevel];
        }

        public double GetBufferRadius(int zoomLevel)
        {
            return _bufferPairByZoomLevel[zoomLevel].GetBufferRadius();
        }
    }

    public struct PixelBufferPair
    {
        public double GroundRes; //Ground resolution in meters
        public int Multiplier;

        public PixelBufferPair(double groundRes, int multiplier)
        {
            this.GroundRes = groundRes;
            this.Multiplier = multiplier;
        }

        public double GetBufferRadius()
        {
            return this.GroundRes * this.Multiplier;
        }
    }
}