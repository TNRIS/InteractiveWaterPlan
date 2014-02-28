
namespace InteractiveWaterPlan.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Linq.Expressions;

    public interface IRepository<TKey, TEntity>
    {
        TEntity GetById(TKey key);
        TEntity LoadById(TKey key);

        void Save(TEntity entity);
        void Update(TEntity entity);
        void SaveOrUpdate(TEntity entity);
        void Delete(TKey key);
        void Flush();

        IQueryable<TEntity> QueryAll();
        TEntity FindOne(Expression<Func<TEntity, bool>> predicate);
    }
}
