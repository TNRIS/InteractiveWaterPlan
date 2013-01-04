using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using NHibernate;

namespace InteractiveWaterPlan.Data
{

    public class CountyNetSupplyRepository : Repository<int, CountyNetSupply>
    {

        #region Constructors

        public CountyNetSupplyRepository(string sessionName) : base(sessionName, typeof(CountyNetSupplyRepository)) { }

        public CountyNetSupplyRepository(ISession session) : base(session, typeof(CountyNetSupplyRepository)) { }

        #endregion


        public IList<CountyNetSupply> GetCountyNetSupplies(string year)
        {
            return Session.GetNamedQuery("GetCountyNetSupplies")
                .SetParameter("year", year)
                .List<CountyNetSupply>()
                .OrderBy(x => x.CountyName)
                .ToList<CountyNetSupply>();
        }

    }
}
