﻿using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using NHibernate;
using Microsoft.SqlServer.Types;

namespace InteractiveWaterPlan.Data
{

    public class BoundaryRepository : AbstractHibernateRepository
    {

        #region Constructors

        public BoundaryRepository(string sessionName) : base(sessionName) { }

        public BoundaryRepository(ISession session) : base(session) { }

        #endregion

        public IEnumerable<object> GetCountyNames()
        {
            return Session.GetNamedQuery("GetAllCounties")
                .List<County>()
                .OrderBy(x => x.Name)
                .Select(x => new { id = x.Id, name = x.Name })
                .ToList();
        }

        public IList<County> GetCounties()
        {
            return Session.GetNamedQuery("GetAllCounties")
                .List<County>()
                .OrderBy(x => x.Name)
                .ToList<County>();
        }

        public IEnumerable<object> GetPlanningRegionNames()
        {
            return Session.GetNamedQuery("GetAllPlanningRegions")
                .List<PlanningRegion>()
                .OrderBy(x => x.Letter)
                .Select(x => new { letter = x.Letter, name = x.Name })
                .ToList();
        }

        public IList<PlanningRegion> GetPlanningRegions(int reduceFactor = 400)
        {
            var planningRegions = Session.GetNamedQuery("GetAllPlanningRegions")
                .List<PlanningRegion>()
                .OrderBy(x => x.Letter)
                .ToList<PlanningRegion>();

            foreach (var planningRegion in planningRegions)
            {
                SqlGeography geog = SqlGeography.Parse(planningRegion.WktGeog);
                SqlGeography reducedGeog = geog.Reduce(reduceFactor);
                planningRegion.WktGeog = reducedGeog.ToString();
            }

            return planningRegions.ToList();
            
        }

        public IEnumerable<object> GetHouseDistrictNames()
        {
            return Session.GetNamedQuery("GetAllHouseDistricts")
                .List<LegeDistrict>()
                .OrderBy(x => x.Id)
                .Select(x => new { 
                    id = x.Id, 
                    districtType = x.DistrictType, 
                    name = x.Name
                })
                .ToList();
        }

        public IEnumerable<object> GetSenateDistrictNames()
        {
            return Session.GetNamedQuery("GetAllSenateDistricts")
                .List<LegeDistrict>()
                .OrderBy(x => x.Id)
                .Select(x => new
                {
                    id = x.Id,
                    districtType = x.DistrictType,
                    name = x.Name
                })
                .ToList();
        }

        public IList<LegeDistrict> GetHouseDistricts()
        {
            return Session.GetNamedQuery("GetAllHouseDistricts")
                .List<LegeDistrict>()
                .OrderBy(x => x.Id)
                .ToList<LegeDistrict>();
        }

        public IList<LegeDistrict> GetSenateDistricts()
        {
            return Session.GetNamedQuery("GetAllSenateDistricts")
                .List<LegeDistrict>()
                .OrderBy(x => x.Id)
                .ToList<LegeDistrict>();
        }

    }
}
