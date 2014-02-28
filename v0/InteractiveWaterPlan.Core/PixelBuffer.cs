using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InteractiveWaterPlan.Core
{

    public class PixelBufferTable
    {
        private IDictionary<int, PixelBufferRecord> _bufferPairByZoomLevel;

        public PixelBufferTable()
        {
            _bufferPairByZoomLevel = new Dictionary<int, PixelBufferRecord>();
        }

        public void AddPixelBufferRecord(int zoomLevel, PixelBufferRecord record)
        {
            this._bufferPairByZoomLevel.Add(zoomLevel, record);
        }

        public PixelBufferRecord GetPixelBufferPair(int zoomLevel)
        {
            return _bufferPairByZoomLevel[zoomLevel];
        }

        public double GetBufferRadius(int zoomLevel)
        {
            return _bufferPairByZoomLevel[zoomLevel].GetBufferRadius();
        }
    }

    public class PixelBufferRecord
    {
        public virtual int ZoomLevel { get; set; }
        public virtual double GroundRes { get; set; } //Ground resolution in meters
        public virtual int Multiplier { get; set; }

        public virtual double GetBufferRadius()
        {
            return this.GroundRes * this.Multiplier;
        }
    }
}