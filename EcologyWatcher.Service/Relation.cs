//------------------------------------------------------------------------------
// <auto-generated>
//     Этот код создан по шаблону.
//
//     Изменения, вносимые в этот файл вручную, могут привести к непредвиденной работе приложения.
//     Изменения, вносимые в этот файл вручную, будут перезаписаны при повторном создании кода.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EcologyWatcher.Service
{
    using System;
    using System.Collections.Generic;
    
    public partial class Relation
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Relation()
        {
            this.Accident_Details = new HashSet<Accident_Details>();
        }
    
        public int Relation_Id { get; set; }
        public string Relation_Name { get; set; }
        public string Relation_Icon { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Accident_Details> Accident_Details { get; set; }
    }
}
