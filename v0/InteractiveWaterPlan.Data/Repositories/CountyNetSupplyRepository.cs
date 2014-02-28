using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using NHibernate;

namespace InteractiveWaterPlan.Data
{

    public class CountyNetSupplyRepository : AbstractHibernateRepository
    {

        #region Constructors

        public CountyNetSupplyRepository(string sessionName) : base(sessionName) { }

        public CountyNetSupplyRepository(ISession session) : base(session) { }

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
